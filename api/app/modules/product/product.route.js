const express = require('express');
const validate = require('express-validation');
const productController = require('./product.controller');
const routes = express.Router();
const rules = require('./product.rule');
const prefix = '/product';
// List
routes.route('').get(productController.getListProduct);

// Change status
routes
  .route('/:product_id(\\d+)/change-status')
  .put(
    validate(rules.changeStatusProduct),
    productController.changeStatusProduct
  );
// Detail
routes.route('/:product_id(\\d+)').get(productController.detailProduct);

routes.route('/order-number').get(productController.getOrderNumber);

routes
  .route('/product-related/:product_id')
  .get(productController.getProductRelated);

routes
  .route('/product-related-modal')
  .get(productController.getProductRelatedModal);

// Create
routes
  .route('')
  .post(validate(rules.createProduct), productController.createProduct);
routes
  .route('/update-product-related/:product_id')
  .post(productController.updateProductRelated);

// Update
routes
  .route('/:product_id(\\d+)')
  .put(validate(rules.updateProduct), productController.updateProduct);

// Delete
routes.route('/:product_id(\\d+)').delete(productController.deleteProduct);

// List options Product
routes.route('/get-options').get(productController.getOptions);

routes.route('/get-qr/:product_id').get(productController.getQRList);


//Thuộc tính
routes.route('/attributes-group').get(productController.getListAttributesGroup);

module.exports = {
  prefix,
  routes,
};
