const express = require('express');
const validate = require('express-validation');
const bannerController = require('./banner.controller');
const routes = express.Router();
const rules = require('./banner.rule');
const prefix = '/banner';


// List
routes.route('')
  .get(bannerController.getListBanner);

// Detail 
routes.route('/:banner_id(\\d+)')
  .get(bannerController.detailBanner);

// Create 
routes.route('')
  .post(validate(rules.createBanner),bannerController.createBanner);

// Update
routes.route('/:banner_id(\\d+)')
  .put(validate(rules.updateBanner),bannerController.updateBanner);

// Delete
routes.route('/:banner_id(\\d+)')
  .delete(bannerController.deleteBanner);

module.exports = {
  prefix,
  routes,
};
