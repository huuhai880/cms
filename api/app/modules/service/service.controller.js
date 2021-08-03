const httpStatus = require('http-status');
const serviceService = require('./service.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

// Get list service 
const getListService = async (req, res, next) => {
  try {
    const serviceRes = await serviceService.getListService(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Create service
const createService = async (req, res, next) => {
  try {
    // Insert service
    const serviceRes = await serviceService.createService(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Update service
const updateService = async (req, res, next) => {
  try {
    const service_id = req.params.service_id;
    // Check service exists
    const serviceResDetail = await serviceService.detailService(service_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update service
    const serviceRes = await serviceService.updateService(req.body,service_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Delete service
const deleteService = async (req, res, next) => {
  try {
    const service_id = req.params.service_id;
    const auth_name = req.auth.user_name;
    // Check service exists
    const serviceResDetail = await serviceService.detailService(service_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Delete service
    const serviceRes = await serviceService.deleteService(service_id,auth_name);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Detail service
const detailService = async (req, res, next) => {
  try {
    const service_id = req.params.service_id;

    const serviceRes = await serviceService.detailService(service_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


module.exports = {
  getListService,
  createService,
  updateService,
  deleteService,
  detailService
};
