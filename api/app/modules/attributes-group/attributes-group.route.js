const express = require('express');
const validate = require('express-validation');
const attributesGroupController = require('./attributes-group.controller');
const routes = express.Router();
const rules = require('./attributes-group.rule');
const prefix = '/attributes-group';

// Get List AttributesGroup
routes.route('').get(attributesGroupController.getListAttributesGroup);

// // Delete
routes
  .route('/:attributes_group_id(\\d+)')
  .delete(attributesGroupController.deleteAttributesGroup);

// Create
routes
  .route('')
  .post(
    validate(rules.createAttributesGroup),
    attributesGroupController.createAttributesGroup
  );

// Update
routes
  .route('/:attributes_group_id(\\d+)')
  .put(
    validate(rules.updateAttributesGroup),
    attributesGroupController.updateAttributesGroup
  );

// Detail
routes
  .route('/:attributes_group_id(\\d+)')
  .get(attributesGroupController.detailAttributesGroup);

module.exports = {
  prefix,
  routes,
};
