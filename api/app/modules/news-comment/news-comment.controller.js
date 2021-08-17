const newsCommentService = require('./news-comment.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

////get list comment
const getListCommentByNewId = async (req, res, next) => {
  // console.log(req.query)
  try {
    const serviceRes = await newsCommentService.getListCommentByNewId(
      req.query
    );
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};
//create new comment
const createNewsComment = async (req, res, next) => {
  try {
    const serviceRes = await newsCommentService.createNewsComment(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.NEWSCATEGORY.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};
//review comment
const reviewNewsComment = async (req, res, next) => {
  try {
    const serviceRes = await newsCommentService.reviewNewsComment(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.NEWSCATEGORY.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};
//delete comment
const deleteNewsComment = async (req, res, next) => {
  try {
    const serviceRes = await newsCommentService.deleteNewsComment(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.NEWSCATEGORY.DELETE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getListCommentByNewId,
  createNewsComment,
  reviewNewsComment,
  deleteNewsComment,
};
