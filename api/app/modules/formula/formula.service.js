const FormulaClass = require('./formula.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');

const getFormulaList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const type_formula = apiHelper.getValueFromObject(queryParams, 'type_formula', 0)

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input(
                'CREATEDDATEFROM',
                apiHelper.getValueFromObject(queryParams, 'startDate')
            )
            .input(
                'CREATEDDATETO',
                apiHelper.getValueFromObject(queryParams, 'endDate')
            )
            .input(
                'ISACTIVE',
                apiHelper.getFilterBoolean(queryParams, 'selectdActive')
            )
            .input(
                'ATTRIBUTESGROUPID',
                apiHelper.getValueFromObject(queryParams, 'attributes_group_id', 0)
            )
            .input('TYPEFORMULA', type_formula)
            .execute('FOR_FORMULA_GetList_AdminWeb');
        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: FormulaClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (e) {
        logger.error(e, {
            function: 'Formulaervice.getFormulaList',
        });

        return new ServiceResponse(true, '', {});
    }
};

const deleteFormula = async (formula_id, body) => {
    const pool = await mssql.pool;
    try {
        await pool
            .request()
            .input('FORMULAID', formula_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('FOR_FORMULA_delete_AdminWeb');
        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, {
            function: 'Formulaervice.deleteFormula',
        });
        return new ServiceResponse(false, e.message);
    }
};

const addFormula = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {

        let is_couple_formula = apiHelper.getValueFromObject(body, 'is_couple_formula', false);
        let is_condition_formula = apiHelper.getValueFromObject(body, 'is_condition_formula', false);
        let ref_formula_id = apiHelper.getValueFromObject(body, 'ref_formula_id', null);
        let ref_condition_id = apiHelper.getValueFromObject(body, 'ref_condition_id', null);
        let interpret_formula_id = apiHelper.getValueFromObject(body, 'interpret_formula_id', null);
        let list_condition_formula = apiHelper.getValueFromObject(body, 'list_condition_formula', []);
        let is_default = apiHelper.getValueFromObject(body, 'is_default', false);
        let formula_id = apiHelper.getValueFromObject(body, 'formula_id', null)

        if (!is_couple_formula) {
            ref_formula_id = null;
            ref_condition_id = null;
            interpret_formula_id = null;
            is_default = false
        }
        if (!is_condition_formula) {
            list_condition_formula = [];
            is_default = false;
        }

        await transaction.begin();

        const reqFormula = new sql.Request(transaction);
        const resFormula = await reqFormula
            .input('FORMULAID', formula_id)
            .input('FORMULANAME', apiHelper.getValueFromObject(body, 'formula_name'))
            .input(
                'ATTRIBUTESGROUPID',
                apiHelper.getValueFromObject(body, 'attribute_gruop_id')
            )
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'desc'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(body, 'order_index'))
            .input('ISFOMULAORTHERID1', apiHelper.getValueFromObject(body, 'type1'))
            .input('ISFOMULAORTHERID2', apiHelper.getValueFromObject(body, 'type2'))
            .input('ORTHERID1', apiHelper.getValueFromObject(body, 'orderid_1'))
            .input('ORTHERID2', apiHelper.getValueFromObject(body, 'orderid_2'))
            .input('CALCULATIONID', apiHelper.getValueFromObject(body, 'calculation_id'))
            .input('ISDEFAULT', is_default)
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('ISTOTALNOSHORTENED', apiHelper.getValueFromObject(body, 'is_total_no_shortened', false))
            .input('ISTOTALSHORTENED', apiHelper.getValueFromObject(body, 'is_total_shortened', false))
            .input('ISTOTAL2DIGIT', apiHelper.getValueFromObject(body, 'is_total_2digit', false))
            .input('ISCONDITIONFORMULA', apiHelper.getValueFromObject(body, 'is_condition_formula', false))
            .input('ISCOUPLEFORMULA', apiHelper.getValueFromObject(body, 'is_couple_formula', false))
            .input('REFFORMULAID', ref_formula_id)
            .input('REFCONDITIONID', ref_condition_id)
            .input('INTERPRETFORMULAID', interpret_formula_id)
            .execute('FOR_FORMULA_CreateOrUpdate_AdminWeb');

        const formula_result_id = resFormula.recordset[0].RESULT;

        if (formula_id && is_condition_formula) {
            const reqDelConditionFormula = new sql.Request(transaction);
            await reqDelConditionFormula
                .input('formulaid', formula_id)
                .input('deleteduser', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute('FOR_FORMULA_CONDITION_Delete_AdminWeb')
        }

        if (is_condition_formula) {
            const reqConditionFormula = new sql.Request(transaction);
            for (let index = 0; index < list_condition_formula.length; index++) {
                let item = list_condition_formula[index];
                await reqConditionFormula
                    .input('FORMULARID', formula_result_id)
                    .input('ATTRIBUTESGROUPID', item.attributes_group_id)
                    .input('VALUE', item.value)
                    .input('ISFORMULAORTHERID1', item.is_formula_orther_id_1)
                    .input('ORTHERID1', item.orther_id_1)
                    .input('CALCULATIONID', item.calculation_id)
                    .input('ISFORMULAORTHERID2', item.is_formula_orther_id_2)
                    .input('ORTHERID2', item.orther_id_2)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute('FOR_FORMULA_CONDITION_Create_AdminWeb')
            }
        }

        await transaction.commit();

        return new ServiceResponse(true, '', formula_result_id);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'Formulaervice.addFormula',
        });
        console.error('Formulaervice.addFormula', error);
        return new ServiceResponse(false, e.message);
    }
};


const detailFormula = async (formula_id) => {
    try {
        const pool = await mssql.pool;
        const resFormula = await pool
            .request()
            .input('FORMULAID', formula_id)
            .execute('FOR_FORMULA_GetById_AdminWeb');

        let formula = FormulaClass.detail(resFormula.recordset[0])

        let { is_condition_formula = false } = formula || {};
        if (is_condition_formula) {
            const resConditionFormula = await pool.request()
                .input('formulaid', formula_id)
                .execute('FOR_FORMULA_CONDITION_GetList_AdminWeb');

            let list_condition_formula = FormulaClass.listConditionFormula(resConditionFormula.recordset)
            formula.list_condition_formula = list_condition_formula || []
        }
        else {
            formula.list_condition_formula = []
        }
        return new ServiceResponse(true, '', formula);
    } catch (e) {
        logger.error(e, {
            function: 'Formulaervice.detailFormula',
        });

        return new ServiceResponse(false, e.message);
    }
};

const getIngredientList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('FOR_FORMULAINGREDIENTS_GetListIngredient_AdminWeb');
        const result = data.recordset;
        return new ServiceResponse(true, '', {
            data: FormulaClass.listIngredient(result),
        });
    } catch (e) {
        logger.error(e, {
            function: 'IngredientService.getParamName',
        });

        return new ServiceResponse(true, '', {});
    }
};

const GetListCalculation = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('FOR_FORMULAINGREDIENTS_GetListCalculation_AdminWeb');
        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: FormulaClass.listCalculation(result),
        });
    } catch (e) {
        logger.error(e, {
            function: 'InterpretService.getRelationshipsList',
        });

        return new ServiceResponse(true, '', {});
    }
};


const GetListFormulaParent = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('FOR_FORMULA_GetListFormulaParent_AdminWeb');
        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: FormulaClass.listFormulaParent(result),
        });
    } catch (e) {
        logger.error(e, {
            function: 'InterpretService.getRelationshipsList',
        });

        return new ServiceResponse(true, '', {});
    }
};

const GetListAttributeGruop = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('FOR_FORMULA_GetListAttributeGruop_AdminWeb');
        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: FormulaClass.listAttributeGruop(result),
        });
    } catch (e) {
        logger.error(e, {
            function: 'InterpretService.getRelationshipsList',
        });

        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getFormulaList,
    GetListCalculation,
    getIngredientList,
    GetListFormulaParent,
    GetListAttributeGruop,
    deleteFormula,
    addFormula,
    detailFormula
};
