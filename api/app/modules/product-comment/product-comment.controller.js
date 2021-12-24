const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const productCommentService = require('./product-comment.service');

const getListComment = async (req, res, next) => {
    try {
        const serviceRes = await productCommentService.getListComment(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const product_comment_id = req.params.product_comment_id;
        let { auth_name } = req.body;
        const serviceRes = await productCommentService.deleteComment(product_comment_id, auth_name);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const reviewComment = async (req, res, next) => {
    try {
        const product_comment_id = req.params.product_comment_id;
        let { auth_name, is_review } = req.body;
        const serviceRes = await productCommentService.reviewComment(product_comment_id, auth_name, is_review);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const replyComment = async (req, res, next) => {
    try {
        const serviceRes = await productCommentService.replyComment(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListComment,
    deleteComment,
    reviewComment,
    replyComment
}