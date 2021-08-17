const express = require('express');
const validate = require('express-validation');
const newsCommentController = require('./news-comment.controller');
const routes = express.Router();
const rules = require('./news-comment.rule');
const prefix = '/news-comment';
routes.route('').get(newsCommentController.getListCommentByNewId);
// Create new a area
routes
  .route('')
  .post(
    validate(rules.createNewsComment),
    newsCommentController.createNewsComment
  );
routes.route('/review').post(newsCommentController.reviewNewsComment);
routes.route('/delete').post(newsCommentController.deleteNewsComment);
module.exports = {
  prefix,
  routes,
};
