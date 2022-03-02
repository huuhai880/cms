const searchHistoryService = require('./search-history.service');
const SingleResponse = require('../../common/responses/single.response');


const getListSearchHistoryFree = async (req, res, next) => {
    try {
        const serviceRes = await searchHistoryService.getListSearchHistoryFree(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getOptionProduct = async (req, res, next) => {
    try {
        const serviceRes = await searchHistoryService.getOptionProduct();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getListSearchHistoryFree,
    getOptionProduct
};
