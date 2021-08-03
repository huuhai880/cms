const express = require('express');
const publishingCompanyController = require('./publishing-company.controller');

const routes = express.Router();

const prefix = '/publishing-company';

routes.route('/').get(publishingCompanyController.getList);

routes.route('/:id(\\d+)').get(publishingCompanyController.detail);

routes.route('/').post(publishingCompanyController.createOrUpdate);

routes.route('/:id(\\d+)').put(publishingCompanyController.createOrUpdate);

routes.route('/:id(\\d+)').delete(publishingCompanyController.deleteById);

// List options publishing company
routes.route('/get-options').get(publishingCompanyController.getOptions);

module.exports = {
  prefix,   
  routes,
};   
