const express = require('express');
const validate = require('express-validation');
const productController = require('./product.controller');
const routes = express.Router();
const rules = require('./product.rule');
const prefix = '/product';


routes.route('/')
    .get(productController.getListProduct)
    .post(validate(rules.createProduct), productController.createProduct);
    
routes
    .route('/:product_id(\\d+)')
    .get(productController.detailProduct)
    .put(validate(rules.updateProduct), productController.updateProduct)
    .delete(productController.deleteProduct);
routes
    .route('/interpret')
    .get(productController.getListInterPretAttributesGroup)
routes.route('/get-options').get(productController.getOptions);
routes.route('/attributes-group').get(productController.getListAttributesGroup);

module.exports = {
    prefix,
    routes,
};
