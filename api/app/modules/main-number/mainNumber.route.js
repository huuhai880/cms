const express = require('express');
const MainNumberController = require('./mainNumber.controller');

const routes = express.Router();

const prefix = '/main-number';
const validate = require('express-validation');
const rules = require('./mainNumber.rule');
// // List options position
// routes.route('/get-options').get(MainNumberController.getOptions);
/////////list MainNumber
routes.route('').get(MainNumberController.getMainNumberList);
/////////list Image by numer id
routes.route('/:mainNumber_id/image-by-numerid').get(MainNumberController.getImageListByNum);
routes.route('/partner').get(MainNumberController.getPartnersList);

//////createOrupdate
routes
  .route('')
  .post(validate(rules.createMainNumber), MainNumberController.addMainNumber);
///detail postion
routes
  .route('/:mainNumber_id(\\d+)')
  .get(MainNumberController.detailMainNumber);
////////detelte position
routes
  .route('/:mainNumber_id/delete')
  .put(MainNumberController.deleteMainNumber);

module.exports = {
  prefix,
  routes,
};
