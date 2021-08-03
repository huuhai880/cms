const express = require('express');
const validate = require('express-validation');
const ConfigController = require('./app-config.controller');
const routes = express.Router();
const prefix = '/config';


// Lấy danh sách vị trí đặt banner 
routes.route('/banner/placement')
  .get(ConfigController.getListPlacementForBanner);

// Lấy danh sách trang web cần cài đặt 
routes.route('/pages')
  .get(ConfigController.getListPageConfig)

// Lấy các cài đặt trên trang 
routes.route('/pages/:page')
  .get(ConfigController.getPageConfig)
  .put(ConfigController.updatePageConfig)

module.exports = {
  prefix,
  routes,
};
