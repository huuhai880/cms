const express = require('express');
const validate = require('express-validation');
const productComboController = require('./product-combo.controller');
const routes = express.Router();
const rules = require('./product-combo.rule');
const prefix = '/product-combo';

routes.route('/')
    .get(productComboController.getListCombo)
    .post(validate(rules.createCombo), productComboController.createCombo)

routes
    .route('/:combo_id(\\d+)')
    .get(productComboController.detailCombo)
    .put(validate(rules.updateCombo), productComboController.updateCombo)
    .delete(productComboController.deleteCombo)


module.exports = {
    prefix,
    routes,
};


