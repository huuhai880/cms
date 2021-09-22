const express = require('express');
const IngredientsController = require('./formula-ingredients.controller');

const routes = express.Router();

const prefix = '/formula-ingredients';
// const validate = require('express-validation');
// const rules = require('./interpret.rule');
///////list interpret
routes.route('').get(IngredientsController.getIngredient);

module.exports = {
  prefix,
  routes,
};
