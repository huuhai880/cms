const express = require('express');
const positionController = require('./position.controller');

const routes = express.Router();

const prefix = '/position';
const validate = require('express-validation');
const rules = require('./position.rule');
// List options position
routes.route('/get-options').get(positionController.getOptions);
/////////list postion
routes.route('').get(positionController.getListPosition);
////////createOrupdate
routes
  .route('')
  .post(
    validate(rules.createPosition),
    positionController.createOrUpdatePosition
  );
///detail postion
routes.route('/:position_id(\\d+)').get(positionController.detailPosition);
////////detelte position
routes.route('/:position_id/delete').put(positionController.deletePosition);
module.exports = {
  prefix,
  routes,
};
