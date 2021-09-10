const express = require('express');
const validate = require('express-validation');
const formulaController = require('./formula-by-dob.controller');
const routes = express.Router();
const rules = require('./formula-by-dob.rule');
const prefix = '/formula-by-dob';

// Get List Formula
routes.route('').get(formulaController.getListFormulaByDob);

// Delete
routes.route('/:formula_id(\\d+)').delete(formulaController.deleteFormulaByDob);

// Options
routes.route('/get-options-paramdob').get(formulaController.getOptionParamdbo);

// Options
routes.route('/get-options-attributes').get(formulaController.getOptionAttributes);

// Options
routes.route('/get-options-formuladob').get(formulaController.getOptionFormulaByDob);

// Options
routes.route('/get-options-calculation').get(formulaController.getOptionCalculation);

// Create
routes
  .route('')
  .post(validate(rules.createFormulaByDob), formulaController.createFormulaByDob);

// Update
routes
  .route('/:formula_id(\\d+)')
  .put(validate(rules.updateFormulaByDob), formulaController.updateFormulaByDob);

// Detail
routes.route('/:formula_id(\\d+)').get(formulaController.detailFormulaByDob);

module.exports = {
  prefix,
  routes,
};
