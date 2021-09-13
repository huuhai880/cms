const express = require('express');
const validate = require('express-validation');
const priceController = require('./price.controller');
const routes = express.Router();
const rules = require('./price.rule');
const prefix = '/price';

routes.route('/')
    .get(priceController.getListPrice)
    .post(validate(rules.createPrice), priceController.createPrice)

routes
    .route('/:price_id(\\d+)')
    .get(priceController.detailPrice)
    .put(validate(rules.updatePrice), priceController.updatePrice)
    .delete(priceController.deletePrice)


module.exports = {
    prefix,
    routes,
};