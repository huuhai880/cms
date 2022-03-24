const express = require('express');
const validate = require('express-validation');
const withdrawRequestController = require('./withdraw-request.controller');
const routes = express.Router();
const prefix = '/withdraw-request';
const withdrawRqRule = require('./withdraw-request.rule')

routes.route('/')
    .get(withdrawRequestController.getListWithdrawRequest)

routes
    .route('/:wd_request_id(\\d+)')
    .get(withdrawRequestController.getWithdrawRequestDetail)

routes.route('/accept')
    .post(validate(withdrawRqRule.accept), withdrawRequestController.acceptWithdrawRequest)

routes.route('/reject')
    .post(validate(withdrawRqRule.reject), withdrawRequestController.rejectWithdrawRequest)

module.exports = {
    prefix,
    routes,
};