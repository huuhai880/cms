const searchHistoryClass = require('./search-history.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

/**
 * Get list FOR_ATTRIBUTES
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListSearchHistory = async (queryParams = {}) => {
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
      .input(
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'start_date')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'end_date')
      )
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CUS_SEARCH_HISTORY_GETLIST_ADMINWEB);

    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: searchHistoryClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { function: 'searchHistoryService.getListSearchHistory' });
    return new ServiceResponse(true, '', {});
  }
};

const deleteSearchHistory = async (member_id, bodyParams) => {
// console.log("🚀 ~ file: search-history.service.js ~ line 56 ~ deleteSearchHistory ~ bodyParams", bodyParams)
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('MEMBERID', member_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .input(
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(bodyParams, 'search_date')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(bodyParams, 'search_date')
      )
      .execute(PROCEDURE_NAME.CUS_SEARCH_HISTORY_DELETE_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'searchHistoryService.deleteSearchHistory',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CUS_SEARCHHISTORY_OPTIONS);
};

const detailSearchHistory = async (member_id, queryParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('MEMBERID', member_id)
      .input(
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'start_date')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'end_date')
      )
      .execute(PROCEDURE_NAME.CUS_SEARCH_HISTORY_GETBYID_ADMINWEB);
    let datas = data.recordset;
    if (datas && datas.length > 0) {
      datas = searchHistoryClass.detail(datas[0]);
      const dataSearchHistoryProduct = await pool
        .request()
        .input('MEMBERID', member_id)
        .input(
          'CREATEDDATEFROM',
          apiHelper.getValueFromObject(queryParams, 'start_date')
        )
        .input(
          'CREATEDDATETO',
          apiHelper.getValueFromObject(queryParams, 'end_date')
        )
        .execute(PROCEDURE_NAME.CUS_SEARCH_HISTORY_GETBYID_PRODUCT_ADMINWEB);
      let dataProduct = dataSearchHistoryProduct.recordset;
      dataProduct = searchHistoryClass.detailProduct(dataProduct);
      datas.list_product = dataProduct;
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'searchHistoryService.detailSearchHistory' });
    return new ServiceResponse(false, e.message);
  }
};

const detailSearchHistoryproduct = async (member_id, queryParams) => {

  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('MEMBERID', member_id)
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input(
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'start_date')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'end_date')
      )
      .execute(PROCEDURE_NAME.CUS_SEARCH_HISTORY_GETBYID_PRODUCT_ADMINWEB);
    let datas = data.recordset;
    return new ServiceResponse(true, '', {
      data: searchHistoryClass.detailProduct(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { function: 'searchHistoryService.detailSearchHistoryproduct' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListSearchHistory,
  deleteSearchHistory,
  detailSearchHistory,
  detailSearchHistoryproduct
};
