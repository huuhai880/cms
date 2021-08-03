const express = require('express');
const validate = require('express-validation');
const rules = require('./contact-customer.rule');
const contactCustomerController = require('./contact-customer.controller');
const routes = express.Router();
const prefix = '/contact-customer';

// List Contact Customer
routes.route('')
  .get(contactCustomerController.getListContactCustomer);

// // create a Contact Customer
// routes.route('')
//   .post(contactCustomerController.createContactCustomer);

// // Update a Contact Customer
// routes.route('/:id(\\d+)')
//   .put(contactCustomerController.updateContactCustomer);

// Delete a Contact Customer
routes.route('/:id(\\d+)')
  .delete(contactCustomerController.deleteContactCustomer);

// Detail a Contact Customer
routes.route('/detail/:id(\\d+)')
  .get(contactCustomerController.detailContactCustomer);

module.exports = {
  prefix,
  routes,
};
