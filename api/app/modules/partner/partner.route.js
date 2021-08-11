const express = require('express');
const validate = require('express-validation');
const partnerController = require('./partner.controller');
const routes = express.Router();
const rules = require('./partner.rule');
const prefix = '/partner';

// Get List Partner
routes.route('').get(partnerController.getListPartner);

// Delete
routes.route('/:partner_id(\\d+)').delete(partnerController.deletePartner);

// Create
routes
  .route('')
  .post(validate(rules.createpartner), partnerController.createPartner);

// Update
routes
  .route('/:partner_id(\\d+)')
  .put(validate(rules.updatePartner), partnerController.updatePartner);

// Detail 
routes
  .route('/:partner_id(\\d+)')
  .get(partnerController.detailPartner);

module.exports = {
  prefix,
  routes,
};
