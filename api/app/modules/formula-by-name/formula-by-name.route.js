const express = require('express');
const validate = require('express-validation');
const formulaByNameController = require('./formula-by-name.controller');
const routes = express.Router();
const rules = require('./formula-by-name.rule');
const prefix = '/formula-by-name';

// Get List FormulaByName
routes.route('').get(formulaByNameController.getListFormulaByName);

// Delete
routes
  .route('/:formula_id(\\d+)')
  .delete(formulaByNameController.deleteFormulaByName);

// Options
routes.route('/get-options-param-name').get(formulaByNameController.getOptionParamName);

// Options
routes
  .route('/get-options-attributes')
  .get(formulaByNameController.getOptionAttributes);

// Options
routes
  .route('/get-options-formula')
  .get(formulaByNameController.getOptionFormulaByName);

// Options
routes
  .route('/get-options-calculation')
  .get(formulaByNameController.getOptionCalculation);

// Create
routes
  .route('')
  .post(
    validate(rules.createFormulaByName),
    formulaByNameController.createFormulaByName
  );

// Update
routes
  .route('/:formula_id(\\d+)')
  .put(
    validate(rules.updateFormulaByName),
    formulaByNameController.updateFormulaByName
  );

// Detail
routes
  .route('/:formula_id(\\d+)')
  .get(formulaByNameController.detailFormulaByName);

module.exports = {
  prefix,
  routes,
};
