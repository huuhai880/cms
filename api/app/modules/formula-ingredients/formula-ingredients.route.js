const express = require('express');
const IngredientController = require('./formula-ingredients.controller');

const routes = express.Router();

const prefix = '/formula-ingredients';
const validate = require('express-validation');
const rules = require('./formula-ingredients.rule');
// // List options position
// routes.route('/get-options').get(MainNumberController.getOptions);
////////////get list attribute
routes.route('/param-dob').get(IngredientController.GetListParamDob);
////////////get list mainnumber
routes.route('/calculation').get(IngredientController.GetListCalculation);
////////////get list relationship
routes.route('/param-name').get(IngredientController.getParamName);
////////////get list relationship
routes.route('/ingredients').get(IngredientController.getIngredientList);
///////list Ingredient
routes.route('').get(IngredientController.getIngredientsList);
// /////////list Image by numer id
// routes.route('/:mainNumber_id/image-by-numerid').get(MainNumberController.getImageListByNum);
// routes.route('/partner').get(MainNumberController.getPartnersList);

//////createOrupdate
routes
  .route('')
  .post(validate(rules.createOrUpdateIngredient), IngredientController.addIngredient);
///detail Ingredient
routes
  .route('/:ingredient_id(\\d+)')
  .get(IngredientController.detailIngredient);
// ////////detelte Ingredient
routes.route('/:ingredient_id/delete').put(IngredientController.deleteIngredient);
// check Ingredient
routes
  .route('/check-ingredient')
  .get(IngredientController.CheckIngredient);
module.exports = {
  prefix,
  routes,
};
