const express = require('express');
const validate = require('express-validation');
const routes = express.Router();
const commentRatingController = require('./comment-rating.controller');

const prefix = '/comment-rating';

// List userGroup
routes.route('').get(commentRatingController.getList);

routes.route('/:id(\\d+)').delete(commentRatingController.deleteById);

routes.route('/:id/images').get(commentRatingController.getImages);

module.exports = {
  prefix,
  routes,
};
