const httpStatus = require('http-status');
const ProductPage = require('./product-page.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getListProductPage = async (req, res, next) => {
    try {
        const serviceRes = await ProductPage.getListProductPage();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data } = serviceRes.getData();
        return res.json(new SingleResponse(data));
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

const getListInterPretPageProduct = async (req, res, next) => {
    try {
        const attributes_group_id = req.params.attributes_group_id;
        const serviceRes = await ProductPage.getListInterPretPageProduct(attributes_group_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data } = serviceRes.getData();
        return res.json(new SingleResponse(data));
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

const getListInterpretSpecial = async (req, res, next) => {
    try {
        const serviceRes = await ProductPage.getListInterpretSpecial();
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


const getListInterpretSpecialPaging = async (req, res, next) => {
    try {
        const serviceRes = await ProductPage.getListInterpretSpecialPaging(req.query);
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
    getListProductPage,
    getListInterPretPageProduct,
    getListInterpretSpecial,
    getListInterpretSpecialPaging
};
