const reviewClass = require('../crm-review/crm-review.class');
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
const config = require('../../../config/config');
const { Console } = require('winston/lib/winston/transports');

/**
 * Get list MD_PARTNER
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListReview = async (queryParams = {}) => {
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
        'REVIEWDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'from_date')
      )
      .input(
        'REVIEWDATETO',
        apiHelper.getValueFromObject(queryParams, 'to_date')
      )
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_REVIEW_GETLIST_ADMINWEB);
    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: reviewClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { function: 'partnerService.getListNews' });
    return new ServiceResponse(true, '', {});
  }
};

const deleteReview= async (review_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('REVIEWID', review_id)
      .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_REVIEW_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'reviewService.deleteReview',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.MD_PARTNER_OPTIONS);
};

const createReviewOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    let review_id = apiHelper.getValueFromObject(bodyParams, 'review_id');
    //check name
    const data = await pool
      .request()
      .input('REVIEWID', review_id)
      .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
      .input('AUTHORID', apiHelper.getValueFromObject(bodyParams, 'author_id'))
      .input(
        'REVIEWCONTENT',
        apiHelper.getValueFromObject(bodyParams, 'review_content')
      )
      .input(
        'ORDERINDEX',
        apiHelper.getValueFromObject(bodyParams, 'order_index')
      )
      .input(
        'REVIEWDATE',
        apiHelper.getValueFromObject(bodyParams, 'review_date')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.CRM_REVIEW_CREATEORUPDATE_ADMINWEB);
    const reviewId = data.recordset[0].RESULT;
    return new ServiceResponse(true, '', reviewId);
  } catch (e) {
    logger.error(e, {
      function: 'reviewService.createReviewOrUpdate',
    });
    return new ServiceResponse(false);
  }
};

const detailReview = async (review_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('REVIEWID', review_id)
      .execute(PROCEDURE_NAME.CRM_REVIEW_GETBYID_ADMINWEB);

    let datas = data.recordset;
    // If exists partner
    if (datas && datas.length > 0) {
      datas = reviewClass.detail(datas[0]);
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'reviewService.detailReview' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListReview,
  deleteReview,
  createReviewOrUpdate,
  detailReview,
};
