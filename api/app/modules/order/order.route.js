const express = require('express');
const OrderController = require('./order.controller');

const routes = express.Router();

const prefix = '/order';

/////////list order
routes.route('').get(OrderController.getOrderList);

///detail order
routes.route('/:order_id(\\d+)').get(OrderController.detailOrder);
/////////list product
routes.route('/:order_id(\\d+)/product').get(OrderController.getListProduct);
////////detelte order
routes.route('/:order_id/delete').put(OrderController.deleteOrder);
module.exports = {
  prefix,
  routes,
};
