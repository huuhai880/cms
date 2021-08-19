const express = require('express');
const validate = require('express-validation');
const reviewController = require('./crm-review.controller');
const routes = express.Router();
const rules = require('./crm-review.rule');
const prefix = '/review';

// List review
routes.route('').get(reviewController.getListReview);

// List options crm_acount
routes.route('/get-options-account').get(reviewController.getOptionsAcount);

// List options crm_author
routes.route('/get-options-author').get(reviewController.getOptionsAuthor);

// Create
routes
  .route('')
  .post(validate(rules.createReview), reviewController.createReview);

// Update
routes
  .route('/:review_id(\\d+)')
  .put(validate(rules.updateReview), reviewController.updateReview);

// Detail
routes.route('/:review_id(\\d+)').get(reviewController.detailReview);

// Delete
routes.route('/:review_id(\\d+)').delete(reviewController.deleteReview);

module.exports = {
  prefix,
  routes,
};
