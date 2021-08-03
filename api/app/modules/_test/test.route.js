const express = require('express');
const TestController = require('./test.controller');
const routes = express.Router();
const prefix = '/_test';

// List am-business
routes.route('/send-mail')
  .get(TestController.sendEmail);

module.exports = {
  prefix,
  routes,
};
