const calcuilationClass = require('./Calculation.class');
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
 * Get list MD_CALCULATION
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListCalculation = async (queryParams = {}) => {
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
      .execute(PROCEDURE_NAME.MD_CALCULATION_GETLIST_ADMINWEB);
    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: calcuilationClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { function: 'calculationService.getListCalculation' });
    return new ServiceResponse(true, '', {});
  }
};

const deleteCalculation = async (calculation_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('CALCULATIONID', calculation_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_CALCULATION_DELETE_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'calculaionService.deleteCaculation',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.FOR_CALCULATION_OPTIONS);
};

const createCalculationOrUpdate = async (bodyParams) => {
  try {
    let pool = await mssql.pool;
    let calculation_id = apiHelper.getValueFromObject(
      bodyParams,
      'calculation_id'
    );

    // check name
    const dataCheckName = await pool
      .request()
      .input('CALCULATIONID', calculation_id)
      .input(
        'CALCULATION',
        apiHelper.getValueFromObject(bodyParams, 'calculation')
      )
      .execute(PROCEDURE_NAME.MD_CALCULATION_CHECKCALCULATION_ADMINWEB);
    if (!dataCheckName.recordset || dataCheckName.recordset[0].RESULT) {
      return new ServiceResponse(
        false,
        RESPONSE_MSG.CALCULATION.EXISTS_NAME,
        null
      );
    }

    const data = await pool
      .request()
      .input('CALCULATIONID', calculation_id)
      .input(
        'CALCULATION',
        apiHelper.getValueFromObject(bodyParams, 'calculation')
      )
      .input(
        'DESCRIPTION',
        apiHelper.getValueFromObject(bodyParams, 'description')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_CALCULATION_CREATEORUPDATE_ADMINWEB);

    const calculationId = data.recordset[0].RESULT;

    return new ServiceResponse(true, '', calculationId);
  } catch (e) {
    logger.error(e, {
      function: 'CalculationService.creatCalculationOrUpdate',
    });
    return new ServiceResponse(false);
  }
};

const detailCalculation = async (calculation_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('CALCULATIONID', calculation_id)
      .execute(PROCEDURE_NAME.MD_CALCULATION_GETBYID_ADMINWEB);
    let datas = data.recordset;
    // If exists Calculation
    if (datas && datas.length > 0) {
      datas = calcuilationClass.detail(datas[0]);
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'calculationService.detailCalculation' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListCalculation,
  deleteCalculation,
  createCalculationOrUpdate,
  detailCalculation,
};
