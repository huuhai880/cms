const express = require('express');
const FarmousController = require('./farmous.controller');

const routes = express.Router();

const prefix = '/farmous';
const validate = require('express-validation');
const rules = require('./farmous.rule');

///////list farmous
routes.route('').get(FarmousController.getFarmoussList);

// //////createOrupdate
routes
  .route('')
  .post(validate(rules.createOrUpdatefarmous), FarmousController.addFarmous);
// ///detail farmous
routes.route('/:farmous_id(\\d+)').get(FarmousController.detailFarmous);
// // ////////detelte farmous
routes.route('/:farmous_id/delete').put(FarmousController.deleteFarmous);
routes.route('/check-farmous').get(FarmousController.CheckFarmous);
module.exports = {
  prefix,
  routes,
};
