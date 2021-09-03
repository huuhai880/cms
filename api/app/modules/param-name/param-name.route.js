const express = require('express');
const validate = require('express-validation');
const paramNameController = require('./param-name.controller');
const routes = express.Router();
const rules = require('./param-name.rule');
const prefix = '/param-name';

// Get List ParamName
routes.route('').get(paramNameController.getListParamName);

// Delete
routes
  .route('/:param_name_id(\\d+)')
  .delete(paramNameController.deleteParamName);

// Create
routes
  .route('')
  .post(validate(rules.createParamName), paramNameController.createParamName);

// Update
routes
  .route('/:param_name_id(\\d+)')
  .put(validate(rules.updateParamName), paramNameController.updateParamName);

// Detail
routes.route('/:param_name_id(\\d+)').get(paramNameController.detailParamName);

module.exports = {
  prefix,
  routes,
};
