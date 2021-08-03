const express = require('express');
const validate = require('express-validation');
const rules = require('./plan-category.rule');
const planCategoryController = require('./plan-category.controller');
const routes = express.Router();
const prefix = '/plan-category';

// List plan category
routes.route('')
  .get(planCategoryController.getListPlanCategory);
// create
routes.route('')
  .post(planCategoryController.createPlanCategory);
// delete
routes.route('/:id')
  .delete(planCategoryController.deletePlanCategory);
// detail
routes.route('/detail/:id')
  .get(planCategoryController.detailPlanCategory);
// get options
routes.route('/get-options')
  .get(planCategoryController.getOption);
// update
routes.route('/:id')
  .put(planCategoryController.updatePlanCategory);

module.exports = {
  prefix,
  routes,
};
