const formulaByDobClass = require('./formula-by-dob.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const fileHelper = require('../../common/helpers/file.helper');
const stringHelper = require('../../common/helpers/string.helper');

/**
 * Get list FOR_FORMULADOB
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListFormulaByDob = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.FOR_FORMULADOB_GETLIST_ADMINWEB);
    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: formulaByDobClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { function: 'formulaService.getListFormulaByDob' });
    return new ServiceResponse(true, '', {});
  }
};

const deleteFormulaByDob = async (formula_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('FORMULAID', formula_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_FORMULADOB_DELETE_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'formulaService.deleteFormulaByDob',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.FOR_FORMULADOB_OPTIONS);
};

const createFormulaByDobOrUpdate = async (bodyParams) => {
  try {
    let pool = await mssql.pool;
    let formula_id = apiHelper.getValueFromObject(bodyParams, 'formula_id');
    let formula_name = apiHelper.getValueFromObject(bodyParams, 'formula_name');
    // check formula
    const dataCheckFormuladob = await pool
      .request()
      .input('FORMULAID', formula_id)
      .input('FORMULANAME', formula_name)
      .execute(PROCEDURE_NAME.FOR_FORMULADOB_CHECKNAME_ADMINWEB);
    if (
      !dataCheckFormuladob.recordset ||
      dataCheckFormuladob.recordset[0].RESULT
    ) {
      return new ServiceResponse(
        false,
        RESPONSE_MSG.FORMULADOB.EXISTS_NAME,
        null
      );
    }

    const datas = await pool
      .request()
      .input('FORMULAID', formula_id)
      .input(
        'FORMULANAME',
        apiHelper.getValueFromObject(bodyParams, 'formula_name')
      )
      .input(
        'ATTRIBUTEID',
        apiHelper.getValueFromObject(bodyParams, 'attribute_id')
      )
      .input(
        'DESCRIPTION',
        apiHelper.getValueFromObject(bodyParams, 'description')
      )
      .input('PARAMID', apiHelper.getValueFromObject(bodyParams, 'param_id'))
      .input(
        'ISTOTALSHORTENED',
        apiHelper.getValueFromObject(bodyParams, 'is_total_shortened')
      )
      .input(
        'LAST2DIGITS',
        apiHelper.getValueFromObject(bodyParams, 'last_2_digits')
      )
      .input(
        'PARENTFORMULAID',
        apiHelper.getValueFromObject(bodyParams, 'parent_formula_id')
      )
      .input(
        'PARENTCALCULATIONID',
        apiHelper.getValueFromObject(bodyParams, 'parent_calculation_id')
      )
      .input(
        'CALCULATIONID',
        apiHelper.getValueFromObject(bodyParams, 'calculation_id')
      )
      .input('INDEX1', apiHelper.getValueFromObject(bodyParams, 'index_1'))
      .input('INDEX2', apiHelper.getValueFromObject(bodyParams, 'index_2'))
      .input(
        'KEYMILESTONES',
        apiHelper.getValueFromObject(bodyParams, 'key_milestones')
      )
      .input(
        'SECONDMILESTONES',
        apiHelper.getValueFromObject(
          bodyParams,
          'second_milestones'
        )
      )
      .input(
        'CHALLENGINGMILESTONES',
        apiHelper.getValueFromObject(bodyParams, 'challenging_milestones')
      )
      .input(
        'AGEMILESTONES',
        apiHelper.getValueFromObject(bodyParams, 'age_milestones')
      )
      .input(
        'YEARMILESTONES',
        apiHelper.getValueFromObject(bodyParams, 'year_milestones')
      )
      .input('VALUES', apiHelper.getValueFromObject(bodyParams, 'values'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_FORMULADOB_CREATEORUPDATE_ADMINWEB);

    const formuladobId = datas.recordset[0].RESULT;

    return new ServiceResponse(true, '', formuladobId);
  } catch (e) {
    logger.error(e, {
      function: 'FormuladobService.creatFormuladobOrUpdate',
    });
    return new ServiceResponse(false);
  }
};

const detailFormulaByDob = async (formula_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('FORMULAID', formula_id)
      .execute(PROCEDURE_NAME.FOR_FORMULADOB_GETBYID_ADMINWEB);
    let datas = data.recordset;
    // If exists partner
    if (datas && datas.length > 0) {
      datas = formulaByDobClass.detail(datas[0]);
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'formulaService.detailFormulaByDob' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListFormulaByDob,
  deleteFormulaByDob,
  createFormulaByDobOrUpdate,
  detailFormulaByDob,
};
