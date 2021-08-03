const httpStatus = require('http-status');
const planCategoryService = require('./plan-category.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

// Get list plan category 
const getListPlanCategory = async (req, res, next) => {
  try {
    const serviceRes = await planCategoryService.getListPlanCategory(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const deletePlanCategory = async (req, res, next) =>{
  const id = req.params.id
  try {
    const serviceRes = await planCategoryService.deletePlanCategory(id, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.PLANCATEGORY.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
}

const getOption = async (req, res, next) => {
  try {
    const serviceRes = await planCategoryService.getOptionsAll(req.query);
    if(serviceRes.isFailed()) {
      return res.json(new SingleResponse([]));
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const createPlanCategory = async (req, res, next) => {
  try {
    req.body.plan_category_id = null;
    const serviceRes = await planCategoryService.createPlanCategoryOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CAMPAIGNSTATUS.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const detailPlanCategory = async (req, res, next) => {
  try {
    const serviceRes = await planCategoryService.detailPlanCategory(req.params.id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updatePlanCategory = async (req, res, next) => {
  try {
    const planCategoryId = req.params.id;
    req.body.plan_category_id = planCategoryId;
    const serviceRes = await planCategoryService.createPlanCategoryOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PLANCATEGORY.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListPlanCategory,
  deletePlanCategory,
  getOption,
  createPlanCategory,
  detailPlanCategory,
  updatePlanCategory
};
