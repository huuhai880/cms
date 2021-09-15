const membershipClass = require('../membership/membership.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const getListMembership = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
    const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null)

    const pool = await mssql.pool;
    const res = await pool.request()
      .input('keyword', keyword)
      .input('startdate', start_date)
      .input('enddate', end_date)
      .input('pagesize', itemsPerPage)
      .input('pageindex', currentPage)
      .execute('CRM_MEMBERSHIPS_GetList_AdminWeb');

    let list = membershipClass.list(res.recordset);
    let total = apiHelper.getTotalData(res.recordset);

    return new ServiceResponse(true, "", { list, total })
  } catch (error) {
    logger.error(error, {
      function: 'membership.service.getListMembership',
    });
    return new ServiceResponse(false, error.message);
  }
};


module.exports = {
  getListMembership
};
