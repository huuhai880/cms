const SingleResponse = require('../../common/responses/single.response');
const affiliateService = require('./affiliate.service');

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

module.exports = {
    getOption,
    getListAffiliate,
    init,
    createAff
}

