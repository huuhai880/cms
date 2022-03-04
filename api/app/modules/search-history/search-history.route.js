const express = require('express');
const searchHistoryController = require('./search-history.controller');
const routes = express.Router();
const prefix = '/search-history';

routes.route('/free').get(searchHistoryController.getListSearchHistoryFree);

routes.route('/option-product').get(searchHistoryController.getOptionProduct);

module.exports = {
  prefix,
  routes,
};
