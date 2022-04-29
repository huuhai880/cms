const SingleResponse = require('../../common/responses/single.response');
const withdrawRequestService = require('./withdraw-request.service');

const getListWithdrawRequest = async (req, res, next) => {
    try {
        const serviceRes = await withdrawRequestService.getListWithdrawRequest(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const getWithdrawRequestDetail = async (req, res, next) => {
    try {
        let { wd_request_id = 0 } = req.params;
        const serviceRes = await withdrawRequestService.getWithdrawRequestDetail(wd_request_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const rejectWithdrawRequest = async (req, res, next) => {
    try {
        const serviceRes = await withdrawRequestService.rejectWithdrawRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const acceptWithdrawRequest = async (req, res, next) => {
    try {
        const serviceRes = await withdrawRequestService.acceptWithdrawRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}


module.exports = {
    getListWithdrawRequest,
    getWithdrawRequestDetail,
    acceptWithdrawRequest,
    rejectWithdrawRequest
}