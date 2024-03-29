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

const initDataOption = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.initDataOption();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const createOrUpdateAff = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.createOrUpdateAff(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        console.log({error})
        return next(error);
    }
}

const getDetailAffiliate = async (req, res, next) => {
    try {
        let { id } = req.params;
        const serviceRes = await affiliateService.getDetailAffiliate(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const upLevelAffiliate = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.upLevelAffiliate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const reportOfAffiliate = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.reportOfAffiliate(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getDataOfAffiliate = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.getDataOfAffiliate(req.query);
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


const getDetailAffRequest = async (req, res, next) => {
    try {
        let { id } = req.params;
        const serviceRes = await affiliateService.getDetailAffRequest(id);
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
    }
}

const updStatusAff = async (req, res, next) => {
    try {
        let {id} = req.params || {};
        const serviceRes = await affiliateService.updStatusAff(Object.assign(req.body, {affiliate_id: id}));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const updPolicyCommisionApply = async (req, res, next) => {
    try {
        const serviceRes = await affiliateService.updPolicyCommisionApply(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getOption,
    getListAffiliate,
    initDataOption,
    createOrUpdateAff,
    getDetailAffiliate,
    upLevelAffiliate,
    reportOfAffiliate,
    getDataOfAffiliate,
    getListAffRequest,
    getDetailAffRequest,
    approveAffRequest,
    rejectAffRequest,
    updStatusAff,
    updPolicyCommisionApply
}

