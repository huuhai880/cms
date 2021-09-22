const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const priceService = require('./price.service');

const getListPrice = async (req, res, next) => {
    try {
        const serviceRes = await priceService.getListPrice(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const createPrice = async (req, res, next) => {
    try {

        //Kiem tra san pham da lam gia hay chua ?
        const serviceResCheck = await priceService.checkProductOrComboMakePrice(req.body);
        if (serviceResCheck.isFailed()) {
            return next(serviceRes);
        }
        let productCheck = serviceResCheck.getData();

        if (productCheck) {
            let { is_apply_combo } = req.body || {};
            let { product_name } = productCheck || {}
            let msgErro = `${is_apply_combo ? 'Combo' : 'Sản phẩm'} "${product_name}" đã được làm giá. Vui lòng kiểm tra lại.`
            return next(
                new ErrorResponse(
                    httpStatus.BAD_REQUEST,
                    null,
                    msgErro
                )
            );
        }

        const serviceRes = await priceService.createPrice(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(
            new SingleResponse(
                serviceRes.getData(),
                RESPONSE_MSG.PRODUCT.CREATE_SUCCESS
            )
        );
    } catch (error) {
        return next(error);
    }
};

const detailPrice = async (req, res, next) => {
    try {
        const price_id = req.params.price_id;
        const serviceRes = await priceService.detailPrice(price_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deletePrice = async (req, res, next) => {
    try {
        const price_id = req.params.price_id;
        req.body.price_id = price_id;
        const serviceRes = await priceService.deletePrice(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse(null, RESPONSE_MSG.PRODUCT.DELETE_SUCCESS)
        );
    } catch (error) {
        return next(error);
    }
};

const updatePrice = async (req, res, next) => {
    try {
        const price_id = req.params.price_id;
        req.body.price_id = price_id;
        const serviceRes = await priceService.updatePrice(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(
            new SingleResponse(
                serviceRes.getData(),
                RESPONSE_MSG.PRODUCT.UPDATE_SUCCESS
            )
        );
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getListPrice,
    createPrice,
    detailPrice,
    deletePrice,
    updatePrice
}


