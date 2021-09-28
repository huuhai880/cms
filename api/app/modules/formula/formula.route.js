const express = require('express');
const FormulaController = require('./formula.controller');

const routes = express.Router();

const prefix = '/formula';
const validate = require('express-validation');
const rules = require('./formula.rule');
// // List options position
// routes.route('/get-options').get(MainNumberController.getOptions);
///////list Formula
routes.route('').get(FormulaController.getFormulaList);
// /////////list Image by numer id
// routes.route('/:mainNumber_id/image-by-numerid').get(MainNumberController.getImageListByNum);
// routes.route('/partner').get(MainNumberController.getPartnersList);

////createOrupdate
routes
  .route('')
  .post(validate(rules.createOrUpdateFormula), FormulaController.addFormula);
///detail Formula
routes.route('/:formula_id(\\d+)').get(FormulaController.detailFormula);
// ////////detelte Formula
routes.route('/:formula_id/delete').put(FormulaController.deleteFormula);
// // check email
// routes
//   .route('/check-Formula')
//   .get(FormulaController.CheckFormula);

////////////get list calculation
routes.route('/calculation').get(FormulaController.GetListCalculation);
////////////get list formula-parent
routes.route('/formula-parent').get(FormulaController.GetListFormulaParent);
////////////get list ingredients
routes.route('/ingredients').get(FormulaController.getIngredientList);
////////////get list attribute-gruop
routes.route('/attribute-gruop').get(FormulaController.GetListAttributeGruop);
module.exports = {
  prefix,
  routes,
};
