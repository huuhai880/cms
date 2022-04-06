const express = require('express');
const validate = require('express-validation');
const policyCommisionController = require('./policy-commision.controller');
const routes = express.Router();
const prefix = '/policy-commision';
const rule = require('./policy-commision.rule')

routes.route('/')
    .get(policyCommisionController.getListPolicyCommision)
    .post(validate(rule.createOrUpdate), policyCommisionController.createOrUpdPolicyCommision)

routes.route('/:id(\\d+)')
    .delete(policyCommisionController.deletePolicyCommision)
    .get(policyCommisionController.detailPolicy)

routes.route('/data-select')
    .get(policyCommisionController.getDataSelect)

module.exports = {
    prefix,
    routes,
};
