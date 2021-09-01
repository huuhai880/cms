const express = require('express');
const validate = require('express-validation');
const calculationController = require('./Calculation.controller');
const routes = express.Router();
const rules = require('./Calculation.rule');
const prefix = '/calculation';

// Get List Calculation
routes.route('').get(calculationController.getListCalculation);

// // Delete
routes
  .route('/:calculation_id(\\d+)')
  .delete(calculationController.deleteCalculation);

// Create
routes
  .route('')
  .post(
    validate(rules.createCalculation),
    calculationController.createCalculation
  );

// Update
routes
  .route('/:calculation_id(\\d+)')
  .put(
    validate(rules.updateCalculation),
    calculationController.updateCalculation
  );

// Detail
routes
  .route('/:calculation_id(\\d+)')
  .get(calculationController.detailCalculation);

module.exports = {
  prefix,
  routes,
};
