const httpStatus = require('http-status');
const crmAccountService = require('./account.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');

const getListCRMAccount = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getListCRMAccount(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
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

const genCode = async (req, res, next) => {
    try {
        // Check ACCOUNT exists
        const serviceRes = await crmAccountService.genCode();
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

const createCRMAccount = async (req, res, next) => {
    try {
        // Insert CRMAccount
        const serviceRes = await crmAccountService.createCRMAccount(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        if (Number(serviceRes.getData()) === Number(-2))
            return next(
                new ErrorResponse(
                    httpStatus.NOT_IMPLEMENTED,
                    '',
                    RESPONSE_MSG.ACCOUNT.CHECK_USENAME_FAILED
                )
            );
        return res.json(
            new SingleResponse(
                serviceRes.getData(),
                RESPONSE_MSG.ACCOUNT.CREATE_SUCCESS
            )
        );
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

const updateCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        // Check CRMAccount exists
        const serviceResDetail = await crmAccountService.detailCRMAccount(
            member_id
        );
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Update CRMAccount
        const serviceRes = await crmAccountService.updateCRMAccount(
            req.body,
            member_id
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        if (Number(serviceRes.getData()) === Number(-2))
            return next(
                new ErrorResponse(
                    httpStatus.NOT_IMPLEMENTED,
                    '',
                    RESPONSE_MSG.ACCOUNT.CHECK_USENAME_FAILED
                )
            );
        return res.json(
            new SingleResponse(null, RESPONSE_MSG.ACCOUNT.UPDATE_SUCCESS)
        );
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


const deleteCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const auth_name = req.auth.user_name;
        // Check ACCOUNT exists
        const serviceResDetail = await crmAccountService.detailCRMAccount(
            member_id
        );
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Delete ACCOUNT
        const serviceRes = await crmAccountService.deleteCRMAccount(
            member_id,
            auth_name
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse(null, RESPONSE_MSG.ACCOUNT.DELETE_SUCCESS)
        );
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

const detailCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;

        // Check ACCOUNT exists
        const serviceRes = await crmAccountService.detailCRMAccount(member_id);
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
const checkEmail = async (req, res, next) => {
    try {
        // Check ACCOUNT exists
        const serviceRes = await crmAccountService.checkEmail(req.query.email);
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

const checkIdCard = async (req, res, next) => {
    // console.log()
    try {
        // Check ACCOUNT exists
        const serviceRes = await crmAccountService.checkIdCard(req.query.id_card);
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

const checkPhone = async (req, res, next) => {
    try {
        // Check ACCOUNT exists
        const serviceRes = await crmAccountService.checkPhone(req.query.phone_number);
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

const getCustomerList = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getCustomerList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data } = serviceRes.getData();
        return res.json(new ListResponse(data));
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

const changeStatusCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        const auth_name = req.auth.user_name;
        const is_active = apiHelper.getValueFromObject(req.body, 'is_active');
        // Check function exists
        const serviceResDetail = await crmAccountService.detailCRMAccount(
            member_id
        );
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await crmAccountService.changeStatusCRMAccount(
            member_id,
            auth_name,
            is_active
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse(null, RESPONSE_MSG.ACCOUNT.CHANGE_STATUS_SUCCESS)
        );
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

const changePassCRMAccount = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;

        // Check function exists
        const serviceResDetail = await crmAccountService.detailCRMAccount(
            member_id
        );
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await crmAccountService.changePassCRMAccount(
            member_id,
            req.body
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse(null, RESPONSE_MSG.ACCOUNT.CHANGE_PASSWORD_SUCCESS)
        );
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

const getOptionAff = async (req, res, next) => {
    try {
        const serviceRes = await crmAccountService.getOptionAff();
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
    getListCRMAccount,
    createCRMAccount,
    updateCRMAccount,
    deleteCRMAccount,
    detailCRMAccount,
    changeStatusCRMAccount,
    changePassCRMAccount,
    genCode,
    checkEmail,
    checkIdCard,
    checkPhone,
    getCustomerList,
    getOptionAff
};
