const httpStatus = require('http-status');
const discountService = require('./discount.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const ErrorResponse = require('../../common/responses/error.response');

/**
 * Get list options discount
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await discountService.getOptions(req.query);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create or update discount
 */
const createOrUpdateDiscount = async (req, res, next) => {
  try {

    const serviceRes = await discountService.createOrUpdateDiscount(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    console.log(error);
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

const getListDiscount = async (req, res, next) => {
  try {
    const serviceRes = await discountService.getListDiscount(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    console.log(serviceRes.getData());
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
}


module.exports = {
  getOptions,
  createOrUpdateDiscount,
  getListDiscount
};
