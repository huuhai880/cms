const SingleResponse = require('../../common/responses/single.response');
const paramOtherService = require('./param-other.service')

const getListParamOther = async (req, res, next) => {
    try {
        const serviceRes = await paramOtherService.getListParamOther(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getDetailParamOther = async (req, res, next) => {
    try {
        let { param_other_id } = req.params;
        const serviceRes = await paramOtherService.getDetailParamOther(param_other_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteParamOther = async (req, res, next) => {
    try {
        let { param_other_id } = req.params;
        let { auth_name } = req.body;

        const serviceRes = await paramOtherService.deleteParamOther(param_other_id, auth_name);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createOrUpdParamOther = async (req, res, next) => {
    try {
        const serviceRes = await paramOtherService.createOrUpdParamOther(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


const getOptionParamOther = async (req, res, next) => {
    try {
        const serviceRes = await paramOtherService.getOptionParamOther();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getListParamOther,
    getDetailParamOther,
    deleteParamOther,
    createOrUpdParamOther,
    getOptionParamOther
}