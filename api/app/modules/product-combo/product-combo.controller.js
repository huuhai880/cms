const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const productComboService = require('./product-combo.service')


const getListCombo = async (req, res, next) => {
    try {
        const serviceRes = await productComboService.getListCombo(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const createCombo = async (req, res, next) => {
    try {
        const serviceRes = await productComboService.createCombo(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(
            new SingleResponse(
                serviceRes.getData(),
                'Tạo Combo thành công.'
            )
        );
    } catch (error) {
        return next(error);
    }
};

const updateCombo = async (req, res, next) => {
    try {
        const comboId = req.params.combo_id;
        req.body.combo_id = comboId;

        const serviceRes = await productComboService.updateCombo(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(
            new SingleResponse(
                serviceRes.getData(),
                'Cập nhật Combo thành công'
            )
        );
    } catch (error) {
        return next(error);
    }
};

const deleteCombo = async (req, res, next) => {
    try {
        const comboId = req.params.combo_id;
        req.body.combo_id = comboId;
        const serviceRes = await productComboService.deleteCombo(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse(null, 'Xoá Combo thành công')
        );
    } catch (error) {
        return next(error);
    }
};

const detailCombo = async (req, res, next) => {
    try {
        const comboId = req.params.combo_id;
        const serviceRes = await productComboService.detailCombo(comboId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};



module.exports = {
    getListCombo,
    createCombo,
    updateCombo,
    deleteCombo,
    detailCombo
}


