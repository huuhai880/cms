const express = require('express');
const ProductController = require('./product-page.controller');

const routes = express.Router();

const prefix = '/product-page';
const validate = require('express-validation');
const rules = require('./product-page.rule');

routes.route('').get(ProductController.getListProductPage);

routes.route('/:attributes_group_id(\\d+)').get(ProductController.getListInterPretPageProduct);

module.exports = {
  prefix,
  routes,
};
