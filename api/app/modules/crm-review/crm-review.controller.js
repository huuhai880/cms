const reviewService = require('./crm-review.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_STORE
 */
const getListReview = async (req, res, next) => {
  try {
    const serviceRes = await reviewService.getListReview(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getOptionsAcount = async (req, res, next) => {
  try {
    const serviceRes = await optionService('CRM_ACCOUNT', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionsAuthor = async (req, res, next) => {
  try {
    const serviceRes = await optionService('CRM_AUTHOR', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review_id = req.params.review_id;
    // Check exists
    const serviceResDetail = await reviewService.detailReview(review_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await reviewService.deleteReview(review_id, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.REVIEW.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    req.body.review_id = null;
    const serviceRes = await reviewService.createReviewOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.REVIEW.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review_id = req.params.review_id;
    req.body.review_id = review_id;
    // Check exists
    const serviceResDetail = await reviewService.detailReview(review_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes = await reviewService.createReviewOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.REVIEW.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

const detailReview = async (req, res, next) => {
  try {
    const serviceRes = await reviewService.detailReview(req.params.review_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getListReview,
  deleteReview,
  getOptionsAcount,
  getOptionsAuthor,
  createReview,
  updateReview,
  detailReview,
};
