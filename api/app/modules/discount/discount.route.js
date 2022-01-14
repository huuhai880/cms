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
routes.route('/:discount_id')
  .get(discountController.getDiscountDetail);
routes.route('/delete/:discount_id')
  .put(discountController.deleteDiscount)
module.exports = {
  prefix,
  routes,
};
