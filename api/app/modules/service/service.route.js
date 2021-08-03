const express = require('express');
const validate = require('express-validation');
const rules = require('./service.rule');
const serviceController = require('./service.controller');
const routes = express.Router();
const prefix = '/service';

// List service
routes.route('')
  .get(serviceController.getListService);
// create a service
routes.route('')
  .post(validate(rules.createService), serviceController.createService);
// Update a service
routes.route('/:service_id(\\d+)')
  .put(validate(rules.updateService), serviceController.updateService);
// Delete a service
routes.route('/:service_id(\\d+)')
  .delete(serviceController.deleteService);
// Detail a service
routes.route('/:service_id(\\d+)')
  .get(serviceController.detailService);

module.exports = {
  prefix,
  routes,
};
