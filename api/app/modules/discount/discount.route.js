const express = require('express');

const discountController = require('./discount.controller');
const routes = express.Router();

const prefix = '/discount';
// List
routes.route('/getOption')
  .get(discountController.getOptions);
routes.route('')
  .get(discountController.getListDiscount);
routes.route('')
  .post(discountController.createOrUpdateDiscount);


module.exports = {
  prefix,
  routes,
};
