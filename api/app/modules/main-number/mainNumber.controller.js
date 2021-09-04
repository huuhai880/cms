const httpStatus = require('http-status');
const MainNumberService = require('./mainNumber.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const addMainNumber = async (req, res, next) => {
  try {
    // Insert MainNumber
    const serviceRes = await MainNumberService.addMainNumber(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    if (Number(serviceRes.getData()) === Number(-2))
      return next(
        new ErrorResponse(
          httpStatus.NOT_IMPLEMENTED,
          '',
          RESPONSE_MSG.ACCOUNT.CHECK_USENAME_FAILED
        )
      );
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
const getPartnersList = async (req, res, next) => {
  try {
    const serviceRes = await MainNumberService.getPartnersList(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data } = serviceRes.getData();
    return res.json(new ListResponse(data));
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
const getMainNumberList = async (req, res, next) => {
  try {
    const serviceRes = await MainNumberService.getMainNumberList(req.query);
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
const getImageListByNum = async (req, res, next) => {
  const mainNumber_id = req.params.mainNumber_id;
  // console.log(req.params.mainNumber_id);
  try {
    const serviceRes = await MainNumberService.getImageListByNum(mainNumber_id);
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
const deleteMainNumber = async (req, res, next) => {
  try {
    const mainNumber_id = req.params.mainNumber_id;

    const serviceRes = await MainNumberService.deleteMainNumber(
      mainNumber_id,
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
const detailMainNumber = async (req, res, next) => {
  try {
    const mainNumber_id = req.params.mainNumber_id;

    // Check ACCOUNT exists
    const serviceRes = await MainNumberService.detailMainNumber(mainNumber_id);
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
const CheckMainNumber = async (req, res, next) => {
  // console.log()
  try {
    // Check ACCOUNT exists
    const serviceRes = await MainNumberService.CheckMainNumber(
      req.query.main_number
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
  getMainNumberList,
  getImageListByNum,
  deleteMainNumber,
  detailMainNumber,
  getPartnersList,
  addMainNumber,
  CheckMainNumber,
};
