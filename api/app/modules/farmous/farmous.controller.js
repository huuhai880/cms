const httpStatus = require('http-status');
const FarmousService = require('./farmous.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const addFarmous = async (req, res, next) => {
  try {
    // Insert Farmous
    const serviceRes = await FarmousService.addFarmous(req.body);
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
const getFarmoussList = async (req, res, next) => {
  try {
    const serviceRes = await FarmousService.getFarmoussList(req.query);
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
const deleteFarmous = async (req, res, next) => {
  try {
    const farmous_id = req.params.farmous_id;

    const serviceRes = await FarmousService.deleteFarmous(farmous_id, req.body);
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
const CheckFarmous = async (req, res, next) => {
  // console.log(req.query.farmous_name);
  try {
    const serviceRes = await FarmousService.CheckFarmous(
      req.query.farmous_name
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
const detailFarmous = async (req, res, next) => {
  try {
    const farmous_id = req.params.farmous_id;

    // Check ACCOUNT exists
    const serviceRes = await FarmousService.detailFarmous(farmous_id);
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
  getFarmoussList,
  deleteFarmous,
  addFarmous,
  detailFarmous,
  CheckFarmous,
};
