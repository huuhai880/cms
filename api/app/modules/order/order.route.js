const express = require('express');
const validate = require('express-validation');
const OrderController = require('./order.controller');
const routes = express.Router();
const rules = require('./order.rule');
const prefix = '/order';


routes.route('/')
    .get(OrderController.getOrderList)
    .post(validate(rules.createOrder), OrderController.createOrUpdateOrder);

routes.route('/:order_id(\\d+)').get(OrderController.detailOrder);

routes.route('/:order_id/delete').put(OrderController.deleteOrder);

routes.route('/init/:order_id(\\d+)').get(OrderController.initOrder);

routes.route('/option').get(OrderController.getOptionProductCombo);

routes.route('/discount-apply').post(OrderController.getListDiscountApply);

module.exports = {
    prefix,
    routes,
};
