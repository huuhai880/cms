const httpStatus = require('http-status');
const ParamTypeService = require('./param-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getParamsListByBirthday = async (req, res, next) => {
  try {
    const serviceRes = await ParamTypeService.getParamsListByBirthday(
      req.query
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

const deleteParamByBirthday = async (req, res, next) => {
  try {
    const param_id = req.params.param_id;

    const serviceRes = await ParamTypeService.deleteParamByBirthday(
      param_id,
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.COMMENT.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

const detailParamType = async (req, res, next) => {
  try {
    const param_id = req.params.param_id;

    // Check ACCOUNT exists
    const serviceRes = await ParamTypeService.detailParamType(param_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

const addParamByBirthday = async (req, res, next) => {
  try {
    // Insert Letter
    const serviceRes = await ParamTypeService.addParamByBirthday(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.ACCOUNT.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};
const CheckParamType = async (req, res, next) => {
  // console.log(req)
  try {
    // Check ACCOUNT exists
    const serviceRes = await ParamTypeService.CheckParamType(
      req.query.param_type
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};
module.exports = {
  getParamsListByBirthday,
  detailParamType,
  deleteParamByBirthday,
  addParamByBirthday,
  CheckParamType,
};
