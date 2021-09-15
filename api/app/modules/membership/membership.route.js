const express = require('express');
const validate = require('express-validation');
const membershipController = require('./membership.controller');
const routes = express.Router();
const rules = require('./membership.rule');
const prefix = '/membership';

routes.route('')
  .get(membershipController.getListMembership);


module.exports = {
  prefix,
  routes,
};
