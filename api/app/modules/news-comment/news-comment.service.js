const newCommentModel = require('./news-comment.class');
// const PROCEDURE_NAME = require("../../common/const/procedureName.const");
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
// const folderName = "productModel";
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
/////////getListCommentByNewId
const getListCommentByNewId = async (queryParams = {}) => {
  // console.log(queryParams)
  const currentPage = apiHelper.getCurrentPage(queryParams);
  const itemsPerPage = apiHelper.getValueFromObject(queryParams, 'pageSize');
  const keyword = apiHelper.getSearch(queryParams);
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGEINDEX', currentPage)
      .input('PAGESIZE', itemsPerPage)
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input('NEWSID', apiHelper.getValueFromObject(queryParams, 'newsId'))
      .input(
        'ISREVIEW',
        apiHelper.getValueFromObject(queryParams, 'selectdReview')
      )
      .input(
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'startDate')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'endDate')
      )
      .execute('NEWS_NEWS_COMMENT_GetCommentById');
    const stores = newCommentModel.listComment(data.recordsets[0]);
    // console.log(data.recordsets[0]);

    return new ServiceResponse(true, '', {
      data: stores,
      total: stores.length,
      page: currentPage,
      limit: itemsPerPage,
    });
  } catch (e) {
    logger.error(e, {
      function: 'service.new-comment.getListCommentByNewId',
    });
    return new ServiceResponse(true, '', {});
  }
};
const createNewsComment = async (bodyParams) => {
  // console.log(bodyParams)
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('NEWSID', apiHelper.getValueFromObject(bodyParams, 'new_id'))
      .input(
        'REPLYTOCOMMENTID',
        apiHelper.getValueFromObject(bodyParams, 'replyToComment_id')
      )
      .input(
        'COMMENTTITLE',
        apiHelper.getValueFromObject(bodyParams, 'comment_title')
      )
      .input(
        'COMMENTCONTENT',
        apiHelper.getValueFromObject(bodyParams, 'comment_content')
      )
      .input(
        'COMMENTUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute('NEWS_NEWS_COMMENT_NewComment');
    const newsCategoryId = data.recordset[0].RESULT;
    return new ServiceResponse(true, '', newsCategoryId);
  } catch (e) {
    logger.error(e, {
      function: 'new-comment.create-new-comment',
    });
    return new ServiceResponse(false);
  }
};
const reviewNewsComment = async (bodyParams) => {
  // console.log(bodyParams)
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
      .input(
        'COMMENTID',
        apiHelper.getValueFromObject(bodyParams, 'replyToComment_id')
      )
      .input(
        'REVIEWUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute('NEWS_NEWS_COMMENT_Review');

    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'new-comment.review-new-comment',
    });
    return new ServiceResponse(false);
  }
};
const deleteNewsComment = async (bodyParams) => {
  // console.log(bodyParams)
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input(
        'COMMENTID',
        apiHelper.getValueFromObject(bodyParams, 'replyToComment_id')
      )
      .input(
        'REVIEWUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute('NEWS_NEWS_COMMENT_Delete');

    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'new-comment.deleteNewsComment',
    });
    return new ServiceResponse(false);
  }
};
module.exports = {
  getListCommentByNewId,
  createNewsComment,
  reviewNewsComment,
  deleteNewsComment,
};
