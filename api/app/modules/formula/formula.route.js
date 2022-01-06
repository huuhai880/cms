const express = require('express');
const FormulaController = require('./formula.controller');
const routes = express.Router();
const prefix = '/formula';
const validate = require('express-validation');
const rules = require('./formula.rule');

routes.route('').get(FormulaController.getFormulaList);

routes
  .route('')
  .post(validate(rules.createOrUpdateFormula), FormulaController.addFormula);


routes.route('/:formula_id(\\d+)').get(FormulaController.detailFormula);

routes.route('/:formula_id/delete').put(FormulaController.deleteFormula);

routes.route('/calculation').get(FormulaController.GetListCalculation);

routes.route('/formula-parent').get(FormulaController.GetListFormulaParent);

routes.route('/ingredients').get(FormulaController.getIngredientList);

routes.route('/attribute-gruop').get(FormulaController.GetListAttributeGruop);

module.exports = {
  prefix,
  routes,
};
