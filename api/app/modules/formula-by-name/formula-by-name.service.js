const formulaByNameClass = require('./formula-by-name.class');
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
 * Get list FOR_FORMULA
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListFormulaByName = async (queryParams = {}) => {
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
      .execute(PROCEDURE_NAME.FOR_FORMULABYNAME_GETLIST_ADMINWEB);
    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: formulaByNameClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, {
      function: 'formulaByNameService.getListFormulaByNameByName',
    });
    return new ServiceResponse(true, '', {});
  }
};

const deleteFormulaByName = async (formula_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('FORMULAID', formula_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_FORMULABYNAME_DELETE_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'formulaByNameService.deleteFormulaByName',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.FOR_FORMULABYNAME_OPTIONS);
};

const createFormulaByNameOrUpdate = async (bodyParams) => {
  try {
    let pool = await mssql.pool;
    let formula_id = apiHelper.getValueFromObject(bodyParams, 'formula_id');
    let formula_name = apiHelper.getValueFromObject(bodyParams, 'formula_name');
    // check formula
    const dataCheckFormulaByName = await pool
      .request()
      .input('FORMULAID', formula_id)
      .input('FORMULANAME', formula_name)
      .execute(PROCEDURE_NAME.FOR_FORMULABYNAME_CHECKNAME_ADMINWEB);
    if (
      !dataCheckFormulaByName.recordset ||
      dataCheckFormulaByName.recordset[0].RESULT
    ) {
      return new ServiceResponse(
        false,
        RESPONSE_MSG.FORMULABYNAME.EXISTS_NAME,
        null
      );
    }

    const dataFormulaByName = await pool
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
      .input('IS2DIGIT', apiHelper.getValueFromObject(bodyParams, 'is_2_digit'))
      .input('IS1DIGIT', apiHelper.getValueFromObject(bodyParams, 'is_1_digit'))
      .input(
        'ISFIRSTLETTER',
        apiHelper.getValueFromObject(bodyParams, 'is_first_letter')
      )
      .input(
        'ISNOTSHORTENED',
        apiHelper.getValueFromObject(bodyParams, 'is_not_shortened')
      )
      .input(
        'ISLASTLETTER',
        apiHelper.getValueFromObject(bodyParams, 'is_last_letter')
      )
      .input(
        'ISONLYFIRSTVOWEL',
        apiHelper.getValueFromObject(bodyParams, 'is_only_first_vowel')
      )
      .input(
        'ISTOTALVOWELS',
        apiHelper.getValueFromObject(bodyParams, 'is_total_vowels')
      )
      .input(
        'ISTOTALVALUES',
        apiHelper.getValueFromObject(bodyParams, 'is_total_values')
      )
      .input(
        'ISCOUNTOFNUM',
        apiHelper.getValueFromObject(bodyParams, 'is_count_of_num')
      )
      .input(
        'ISTOTALCONSONANT',
        apiHelper.getValueFromObject(bodyParams, 'is_total_consonant')
      )
      .input(
        'ISTOTALLETTERS',
        apiHelper.getValueFromObject(bodyParams, 'is_total_letters')
      )
      .input(
        'ISNUMSHOW3TIME',
        apiHelper.getValueFromObject(bodyParams, 'is_num_show_3_time')
      )
      .input(
        'ISTOTALFIRSTLETTERS',
        apiHelper.getValueFromObject(bodyParams, 'is_total_first_letters')
      )
      .input(
        'ISNUMOFLETTERS',
        apiHelper.getValueFromObject(bodyParams, 'is_num_of_letters')
      )
      .input(
        'ISNUMSHOW0TIME',
        apiHelper.getValueFromObject(bodyParams, 'is_num_show_0_time')
      )
      .input(
        'PARAMNAMEID',
        apiHelper.getValueFromObject(bodyParams, 'param_name_id')
      )
      .input(
        'ISEXPRESSION',
        apiHelper.getValueFromObject(bodyParams, 'is_expression')
      )
      .input(
        'CALCULATIONID',
        apiHelper.getValueFromObject(bodyParams, 'calculation_id')
      )
      .input(
        'PARENTFORMULAID',
        apiHelper.getValueFromObject(bodyParams, 'parent_formula_id')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_FORMULABYNAME_CREATEORUPDATE_ADMINWEB);

    const formulaByNameId = dataFormulaByName.recordset[0].RESULT;

    return new ServiceResponse(true, '', formulaByNameId);
  } catch (e) {
    logger.error(e, {
      function: 'FormulaByNameService.creatFormulaByNameOrUpdate',
    });
    return new ServiceResponse(false);
  }
};

const detailFormulaByName = async (formula_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('FORMULAID', formula_id)
      .execute(PROCEDURE_NAME.FOR_FORMULABYNAME_GETBYID_ADMINWEB);
    let datas = data.recordset;
    // If exists partner
    if (datas && datas.length > 0) {
      datas = formulaByNameClass.detail(datas[0]);
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'formulaByNameService.detailFormulaByName' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListFormulaByName,
  deleteFormulaByName,
  createFormulaByNameOrUpdate,
  detailFormulaByName,
};
