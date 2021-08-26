const httpStatus = require('http-status');
const PositonService = require('./position.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
/**
 * Get list options position
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_POSITION', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
const getListPosition = async (req, res, next) => {
  try {
    const serviceRes = await PositonService.getListPosition(req.query);
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
const createOrUpdatePosition = async (req, res, next) => {
  try {
    // Insert CRMAccount
    const serviceRes = await PositonService.createOrUpdatePosition(req.body);
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
const detailPosition = async (req, res, next) => {
  try {
    const position_id = req.params.position_id;

    // Check ACCOUNT exists
    const serviceRes = await PositonService.detailPosition(position_id);
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
const checkName = async (req, res, next) => {
  try {
    // Check ACCOUNT exists
    const serviceRes = await PositonService.checkName(req.query.name);
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
const deletePosition = async (req, res, next) => {
  try {
    const position_id = req.params.position_id;

    const serviceRes = await PositonService.deletePosition(
      position_id,
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

module.exports = {
  getOptions,
  getListPosition,
  createOrUpdatePosition,
  detailPosition,
  deletePosition,checkName
};
