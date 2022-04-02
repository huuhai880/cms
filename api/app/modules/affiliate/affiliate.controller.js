const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const affiliateService = require('./affiliate.service');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');

const getOption = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.getOption();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getListAffiliate = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.getListAffiliate(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const init = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.init();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const createAff = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.createAff(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getDetailAff = async (req, res, next) => {
    try {
        let { id } = req.params;
        const serviceRes = await affiliateService.getDetailAff(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const reviewAff = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.reviewAff(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}


const upLevelAff = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.upLevelAff(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const infoAff = async (req, res, next) => {
    try {
        let { id } = req.params
        const serviceRes = await affiliateService.infoAff(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const reportOfAff = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.reportOfAff(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}


const getListOrderAff = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.getListOrderAff(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getListCustomerAff = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.getListCustomerAff(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getListMemberAff = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.getListMemberAff(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getListAffRequest = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.getListAffRequest(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}


const detailAffRequest = async (req, res, next) => {
    try {
        let { id } = req.params;
        const serviceRes = await affiliateService.detailAffRequest(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const rejectAffRequest = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.rejectAffRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const approveAffRequest = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.approveAffRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
        // return next(
        //     new ErrorResponse(
        //         httpStatus.NOT_IMPLEMENTED,
        //         error,
        //         RESPONSE_MSG.REQUEST_FAILED
        //     )
        // );
    }
}



module.exports = {
    getOption,
    getListAffiliate,
    init,
    createAff,
    getDetailAff,
    reviewAff,
    upLevelAff,
    infoAff,
    reportOfAff,
    getListOrderAff,
    getListCustomerAff,
    getListMemberAff,
    getListAffRequest,
    detailAffRequest,
    approveAffRequest,
    rejectAffRequest
}

