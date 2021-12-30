const express = require('express');
const validate = require('express-validation');
const paramOtherController = require('./param-other.controller');
const routes = express.Router();
const rules = require('./param-other.rule');
const prefix = '/param-other';


routes.route('/')
    .get(paramOtherController.getListParamOther)
    .post(validate(rules.createOrUpdParamOther), paramOtherController.createOrUpdParamOther)

routes
    .route('/:param_other_id(\\d+)')
    .get(paramOtherController.getDetailParamOther)
    .delete(paramOtherController.deleteParamOther)

routes.route('/option')
    .get(paramOtherController.getOptionParamOther)

module.exports = {
    prefix,
    routes,
};

