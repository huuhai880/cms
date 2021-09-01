const express = require('express');
const validate = require('express-validation');
const attributesController = require('./attributes.controller');
const routes = express.Router();
const rules = require('./attributes.rule');
const prefix = '/attributes';

// Get List Attributes
routes.route('').get(attributesController.getListAtributes);

// Delete
routes.route('/:attribute_id(\\d+)').delete(attributesController.deleteAttributes);

// Options
routes.route('/get-options').get(attributesController.getOptions);

// Create
routes
  .route('')
  .post(validate(rules.createAttributes), attributesController.createAttributes);

// Update
routes
  .route('/:attribute_id(\\d+)')
  .put(validate(rules.updateAttributes), attributesController.updateAttributes);

// Detail
routes.route('/:attribute_id(\\d+)').get(attributesController.detailAttributes);

module.exports = {
  prefix,
  routes,
};
