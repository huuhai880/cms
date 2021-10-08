const FormulaClass = require('./formula.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
// const fileHelper = require('../../common/helpers/file.helper');
// const folderName = 'mainNumber';
// const config = require('../../../config/config');
///////get list main number
const getFormulaList = async (queryParams = {}) => {
  // console.log('queryParams');

  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
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
      .execute('FOR_FORMULA_GetList_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: FormulaClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'Formulaervice.getFormulaList',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////delete Formula
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

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
// /////check Formula
// const CheckFormula = async (Formula) => {
//   // console.log(email)
//   try {
//     const pool = await mssql.pool;
//     const data = await pool
//       .request()
//       .input('Formula', Formula)
//       .execute('MD_Formula_CheckFormula_AdminWeb');
//     const res = data.recordset[0];
//     if (res) {
//       return new ServiceResponse(true, '', res);
//     }
//     return new ServiceResponse(true, '', '');
//   } catch (error) {
//     return new ServiceResponse(false, error.message);
//   }
// };
// /// add or update Formula
const addFormula = async (body = {}) => {
  // console.log(body);

  // console.log(body)
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();

    /////create or update number
    const requestFormula = new sql.Request(transaction);
    const resultFormula = await requestFormula
      .input('FORMULAID', apiHelper.getValueFromObject(body, 'formula_id'))
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
      .input(
        'CALCULATIONID',
        apiHelper.getValueFromObject(body, 'calculation_id')
      )
      .input('ISDEFAULT', apiHelper.getValueFromObject(body, 'is_default'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('FOR_FORMULA_CreateOrUpdate_AdminWeb');
    const Formula_id = resultFormula.recordset[0].RESULT;

    if (Formula_id > 0) {
      // removeCacheOptions();
      await transaction.commit();
    }
    return new ServiceResponse(true, '', Formula_id);
  } catch (error) {
    logger.error(error, {
      function: 'Formulaervice.addFormula',
    });
    console.error('Formulaervice.addFormula', error);
    return new ServiceResponse(false, e.message);
  }
};
///////detail list Formula
const detailFormula = async (formula_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('FORMULAID', formula_id)
      .execute('FOR_FORMULA_GetById_AdminWeb');
    const Formula = data.recordset[0];
    // console.log(Formula)
    if (Formula) {
      return new ServiceResponse(true, '', FormulaClass.detail(Formula));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'Formulaervice.detailFormula',
    });

    return new ServiceResponse(false, e.message);
  }
};
///////get list Ingredient
const getIngredientList = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_FORMULAINGREDIENTS_GetListIngredient_AdminWeb');
    const result = data.recordset;
    // console.log(result);

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
///////get list Calculation
const GetListCalculation = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_FORMULAINGREDIENTS_GetListCalculation_AdminWeb');
    const result = data.recordset;
    // console.log(result);

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
///////get list Calculation
const GetListFormulaParent = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_FORMULA_GetListFormulaParent_AdminWeb');
    const result = data.recordset;
    // console.log(result);

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
///////get list Calculation
const GetListAttributeGruop = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_FORMULA_GetListAttributeGruop_AdminWeb');
    const result = data.recordset;
    // console.log(result);

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
  detailFormula,
  // CheckFormula,
};
