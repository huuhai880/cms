const express = require('express');
const validate = require('express-validation');
const rules = require('./plan.rule');
const planController = require('./plan.controller');
const routes = express.Router();
const prefix = '/plan';

// List plan
routes.route('')
  .get(planController.getListPlan);

// create a plan
routes.route('')
  .post(planController.createPlan);

// Update a plan
routes.route('/:id(\\d+)')
  .put(planController.updatePlan);

// Delete a plan
routes.route('/:id(\\d+)')
  .delete(planController.deletePlan);

// Detail a plan
routes.route('/detail/:id(\\d+)')
  .get(planController.detailPlan);

module.exports = {
  prefix,
  routes,
};
