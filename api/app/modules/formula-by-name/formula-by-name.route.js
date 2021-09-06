const express = require('express');
const validate = require('express-validation');
const formulaByIdController = require('./formula-by-name.controller');
const routes = express.Router();
const rules = require('./formula-by-name.rule');
const prefix = '/formula-by-name';

// Get List FormulaByName
routes.route('').get(formulaByIdController.getListFormulaByName);

// Delete
routes
  .route('/:formula_by_name_id(\\d+)')
  .delete(formulaByIdController.deleteFormulaByName);

// Options
routes.route('/get-options-letter').get(formulaByIdController.getOptionLetter);

// Options
routes
  .route('/get-options-attributes')
  .get(formulaByIdController.getOptionAttributes);

// Options
routes
  .route('/get-options-formula')
  .get(formulaByIdController.getOptionFormulaByName);

// Options
routes
  .route('/get-options-calculation')
  .get(formulaByIdController.getOptionCalculation);

// Create
routes
  .route('')
  .post(
    validate(rules.createFormulaByName),
    formulaByIdController.createFormulaByName
  );

// Update
routes
  .route('/:formula_by_name_id(\\d+)')
  .put(
    validate(rules.updateFormulaByName),
    formulaByIdController.updateFormulaByName
  );

// Detail
routes
  .route('/:formula_by_name_id(\\d+)')
  .get(formulaByIdController.detailFormulaByName);

module.exports = {
  prefix,
  routes,
};
