const express = require('express');
const searchHistoryController = require('./search-history.controller');
const routes = express.Router();
const prefix = '/search-history';

// Get List searchHistory
routes.route('').get(searchHistoryController.getListSearchHistory);

// Delete
routes.route('/:member_id(\\d+)').delete(searchHistoryController.deleteSearchHistory);

// Detail
routes.route('/:member_id(\\d+)').get(searchHistoryController.detailSearchHistory);

// Detail Product
routes.route('/product/:member_id(\\d+)').get(searchHistoryController.detailSearchHistoryproduct);

module.exports = {
  prefix,
  routes,
};
