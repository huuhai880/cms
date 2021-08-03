const express = require('express');
const validate = require('express-validation');
const rules = require('./author.rule');
const authorController = require('./author.controller');
const routes = express.Router();
const prefix = '/author';

// List author
routes.route('')
  .get(authorController.getListAuthor);
// create a author
routes.route('')
  .post(validate(rules.createAuthor), authorController.createAuthor);
// Change status a author
routes.route('/:author_id(\\d+)/change-status')
  .put(validate(rules.changeStatusAuthor), authorController.changeStatusAuthor);
// Update a am-busines
routes.route('/:author_id(\\d+)')
  .put(validate(rules.updateAuthor), authorController.updateAuthor);
// Delete a author
routes.route('/:author_id(\\d+)')
  .delete(authorController.deleteAuthor);

// Detail a author
routes.route('/:author_id(\\d+)')
  .get(authorController.detailAuthor);

// Change pass author
routes.route('/:author_id/change-password')
  .put(authorController.changePassAuthor);

// Generate username
routes.route('/create')
  .post(authorController.generateAuthorName);

// List options Author
routes.route('/get-options')
  .get(authorController.getOptions);

module.exports = {
  prefix,
  routes,
};
