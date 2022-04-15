const express = require('express');
const validate = require('express-validation');
const rules = require('./account.rule');
const crmAccountController = require('./account.controller');
const routes = express.Router();
const prefix = '/account';

routes.route('')
    .get(crmAccountController.getListCRMAccount);

routes.route('')
    .post(validate(rules.createCRMAccount), crmAccountController.createCRMAccount);

routes
    .route('/:member_id(\\d+)/change-status')
    .put(validate(rules.changeStatusCRMAccount), crmAccountController.changeStatusCRMAccount);

routes.route('/:member_id(\\d+)')
    .put(validate(rules.updateCRMAccount), crmAccountController.updateCRMAccount);

routes.route('/:member_id(\\d+)')
    .delete(crmAccountController.deleteCRMAccount);

routes.route('/:member_id(\\d+)')
    .get(crmAccountController.detailCRMAccount);

routes.route('/check-email')
    .get(crmAccountController.checkEmail);

routes.route('/check-phone')
    .get(crmAccountController.checkPhone);

routes.route('/check-idcard')
    .get(crmAccountController.checkIdCard);

routes.route('/:member_id/change-password')
    .put(crmAccountController.changePassCRMAccount);

routes.route('/gen-code')
    .get(crmAccountController.genCode);

routes.route('/customer-type')
    .get(crmAccountController.getCustomerList);

routes.route('/aff/option')
    .get(crmAccountController.getOptionAff);

module.exports = {
    prefix,
    routes,
};
