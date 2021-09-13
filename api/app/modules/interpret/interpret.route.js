const express = require('express');
const InterpretController = require('./interpret.controller');

const routes = express.Router();

const prefix = '/interpret';
const validate = require('express-validation');
const rules = require('./interpret.rule');
///////list interpret
routes.route('').get(InterpretController.getInterpretsList);
////////////get list interpret detail
routes.route('/interpret-detail').get(InterpretController.getDetailListByInterpret);
////////////get list attribute
routes.route('/attribute').get(InterpretController.getAttributesList);
////////////get list mainnumber
routes.route('/mainnumber').get(InterpretController.getMainNumberList);
////////////get list InterpretParent
routes.route('/interpretParent/:interpret_id(\\d+)').get(InterpretController.getDetailInterpretParent);
////////////get list relationship
routes.route('/relationship').get(InterpretController.getRelationshipsList);
//////createOrupdate interpret
routes
  .route('')
  .post(
    validate(rules.createOrUpdateIntergret),
    InterpretController.addIntergret
  );
  //////createOrupdate interpret detail
routes
.route('/interpret-detail')
.post(
  validate(rules.createOrUpdateIntergretDetail),
  InterpretController.addIntergretDetail
);
///detail interpret
routes.route('/interpret-detail/:interpret_detail_id(\\d+)').get(InterpretController.detaiDetailInterpret);
///detail interpret
routes.route('/:interpret_id(\\d+)').get(InterpretController.detaiIntergret);
// ////////detelte interpret
routes.route('/:interpret_id/delete').put(InterpretController.deleteInterpret);
// ////////detelte interpret
routes.route('/interpret-detail/:interpret_detail_id/delete').put(InterpretController.deleteDetailInterpret);
/////////check  interpret detail
routes
  .route('/interpret-detail/check-interpret')
  .get(InterpretController.CheckDetailInterpret);
module.exports = {
  prefix,
  routes,
};
