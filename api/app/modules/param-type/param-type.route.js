const express = require('express');
const ParamTypeController = require('./param-type.controller');

const routes = express.Router();

const prefix = '/param-type';
const validate = require('express-validation');
const rules = require('./param-type.rule');
// // List options position
// routes.route('/get-options').get(MainNumberController.getOptions);

/////////list param-type
routes.route('').get(ParamTypeController.getParamsListByBirthday);

//////createOrupdate param-type
routes
  .route('')
  .post(
    validate(rules.createOrUpdateParamType),
    ParamTypeController.addParamByBirthday
  );
///detail param-type
routes.route('/:param_id(\\d+)').get(ParamTypeController.detailParamType);
////////detelte param-type
routes
  .route('/:param_id/delete')
  .put(ParamTypeController.deleteParamByBirthday);
//////check param-type
routes.route('/check-param').get(ParamTypeController.CheckParamType);
module.exports = {
  prefix,
  routes,
};
