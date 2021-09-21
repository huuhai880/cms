const httpStatus = require('http-status');
const OrderService = require('./order.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getOrderList = async (req, res, next) => {
  try {
    const serviceRes = await OrderService.getOrderList(req.query);
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

const detailOrder = async (req, res, next) => {
  try {
    const order_id = req.params.order_id;

    // Check ACCOUNT exists
    const serviceRes = await OrderService.detailOrder(order_id);
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
const getListProduct = async (req, res, next) => {
  try {
    const order_id = req.params.order_id;
    // console.log(order_id)
    const serviceRes = await OrderService.getListProduct(order_id);
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
const deleteOrder = async (req, res, next) => {
  try {
    const order_id = req.params.order_id;

    const serviceRes = await OrderService.deleteOrder(order_id, req.body);
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
  getOrderList,
  detailOrder,
  getListProduct,
  deleteOrder,
};
