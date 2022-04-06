const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const policyCommisionService = require('./policy-commision.service');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');

const getListPolicyCommision = async (req, res, next) => {
    try {
        const serviceRes = await policyCommisionService.getListPolicyCommision(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const deletePolicyCommision = async (req, res, next) => {
    try {
        let { id } = req.params || {};
        const serviceRes = await policyCommisionService.deletePolicyCommision(Object.assign(req.body, { id }));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getDataSelect = async (req, res, next) => {
    try {
        const serviceRes = await policyCommisionService.getDataSelect();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const createOrUpdPolicyCommision = async (req, res, next) => {
    try {
        const serviceRes = await policyCommisionService.createOrUpdPolicyCommision(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const detailPolicy = async (req, res, next) => {
    try {
        let { id } = req.params
        const serviceRes = await policyCommisionService.detailPolicy(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        console.log({error})
        return next(error);
    }
}

module.exports = {
    getListPolicyCommision,
    deletePolicyCommision,
    getDataSelect,
    createOrUpdPolicyCommision,
    detailPolicy
}