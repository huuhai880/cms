const express = require('express');
const validate = require('express-validation');
const rules = require('./faq.rule');
const faqController = require('./faq.controller');
const routes = express.Router();
const prefix = '/faq';

// List service
routes.route('')
  .get(faqController.getListFaq);

// get newest index
routes.route('/get-newest-index/:type(\\d+)')
.get(faqController.getNewestIndex)
// create a service
routes.route('')
  .post(faqController.createFaq);
// Update a service
routes.route('/:faq_id(\\d+)')
  .put(faqController.updateFaq);
// Delete a service
routes.route('/:faq_id(\\d+)')
  .delete(faqController.deleteFaq);
// Detail a service
routes.route('/:faq_id(\\d+)')
  .get(faqController.detailFaq);

module.exports = {
  prefix,
  routes,
};
