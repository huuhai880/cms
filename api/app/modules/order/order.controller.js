const httpStatus = require('http-status');
const OrderService = require('./order.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const PagedList = require('../../common/classes/pagedList.class');

const getOrderList = async (req, res, next) => {
    try {
        const serviceRes = await OrderService.getOrderList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, report } = serviceRes.getData() || {};
        const listData = new PagedList(data, total, page, limit);

        return res.json(new SingleResponse(Object.assign(listData, { report })));
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

const initOrder = async (req, res, next) => {
    try {
        let { order_id } = req.params;
        const serviceRes = await OrderService.initCreateOrder(order_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        console.log({ error })
        return next(
            new ErrorResponse(
                httpStatus.NOT_IMPLEMENTED,
                error,
                RESPONSE_MSG.REQUEST_FAILED
            )
        );
    }
};

const createOrUpdateOrder = async (req, res, next) => {
    try {
        const serviceRes = await OrderService.createOrUpdateOrder(req.body);
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

const getOptionProductCombo = async (req, res, next) => {
    try {
        const serviceRes = await OrderService.getOptionProductCombo();
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
    getOrderList,
    detailOrder,
    deleteOrder,
    initOrder,
    createOrUpdateOrder,
    getOptionProductCombo
};
