const express = require('express');
const validate = require('express-validation');
const formulaController = require('./formula.controller');
const routes = express.Router();
const rules = require('./formula.rule');
const prefix = '/formula';

// Get List Formula
routes.route('').get(formulaController.getListFormula);

// Delete
routes.route('/:formula_id(\\d+)').delete(formulaController.deleteFormula);

// Options
routes.route('/get-options-attributes').get(formulaController.getOptionAttributes);

// Options
routes.route('/get-options-formula').get(formulaController.getOptionFormula);

// Options
routes.route('/get-options-calculation').get(formulaController.getOptionCalculation);

// Create
routes
  .route('')
  .post(validate(rules.createFormula), formulaController.createFormula);

// Update
routes
  .route('/:formula_id(\\d+)')
  .put(validate(rules.updateFormula), formulaController.updateFormula);

// Detail
routes.route('/:formula_id(\\d+)').get(formulaController.detailFormula);

module.exports = {
  prefix,
  routes,
};
