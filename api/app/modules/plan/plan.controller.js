const httpStatus = require('http-status');
const planService = require('./plan.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const htmlHelper = require('../../common/helpers/html.helper');
const events = require('../../common/events');
const ValidationResponse = require('../../common/responses/validation.response');
const config = require('../../../config/config');

// Get list Plan 
const getListPlan = async (req, res, next) => {
  try {
    const serviceRes = await planService.getListPlan(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const {data, total, page, limit} = serviceRes.getData();

    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Create Plan
const createPlan = async (req, res, next) => {
  try {
    // Insert Plan
    const serviceRes = await planService.createPlan(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PLAN.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Update Plan
const updatePlan = async (req, res, next) => {
  try {
    const plan_id = req.params.id;
    // Check Plan exists
    // const serviceResDetail = await PlanService.detailPlan(Plan_id);
    // if(serviceResDetail.isFailed()) {
    //   return next(serviceResDetail);
    // }
    // Update Plan
    const serviceRes = await planService.updatePlan(req.body,plan_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.PLAN.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Delete Plan
const deletePlan = async (req, res, next) => {
  try {
    const plan_id = req.params.id;
    const auth_name = req.auth.user_name;
    // // Check Plan exists
    // const serviceResDetail = await PlanService.detailPlan(plan_id);
    // if(serviceResDetail.isFailed()) {
    //   return next(serviceResDetail);
    // }
    // Delete Plan
    const serviceRes = await planService.deletePlan(plan_id, auth_name);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.PLAN.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Detail Plan
const detailPlan = async (req, res, next) => {
  try {
    const plan_id = req.params.id;
    const serviceRes = await planService.detailPlan(plan_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


module.exports = {
  getListPlan,
  createPlan,
  updatePlan,
  deletePlan,
  detailPlan
};
