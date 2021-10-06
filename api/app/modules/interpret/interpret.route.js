const express = require('express');
const InterpretController = require('./interpret.controller');
const routes = express.Router();
const prefix = '/interpret';
const validate = require('express-validation');
const rules = require('./interpret.rule');

routes
  .route('/')
  .get(InterpretController.getInterpretsList)
  .post(
    validate(rules.createOrUpdateIntergret),
    InterpretController.addIntergret
  );
routes.route('/attribute-detail').get(InterpretController.getAttributesListDetail);

routes
  .route('/copy')
  .post(
    validate(rules.createOrUpdateIntergret),
    InterpretController.copyIntergret
  );

routes
  .route('/interpret-detail')
  .get(InterpretController.getDetailListByInterpret);

routes.route('/attribute').get(InterpretController.getAttributesList);
routes
  .route('/attribute/:interpret_id(\\d+)/exclude/:attribute_id(\\d+)')
  .get(InterpretController.getListAttributeExcludeById);

routes.route('/mainnumber').get(InterpretController.getMainNumberList);
routes
  .route('/parent/:interpret_id(\\d+)/:interpret_detail_id(\\d+)')
  .get(InterpretController.getListInterpretParent);
routes.route('/relationship').get(InterpretController.getRelationshipsList);

routes
  .route('/interpret-detail')
  .post(
    validate(rules.createOrUpdateIntergretDetail),
    InterpretController.addIntergretDetail
  );

routes
  .route('/interpret-detail/:interpret_detail_id(\\d+)')
  .get(InterpretController.detaiDetailInterpret);
routes.route('/:interpret_id(\\d+)').get(InterpretController.detaiIntergret);
routes.route('/:interpret_id/delete').put(InterpretController.deleteInterpret);
routes
  .route('/interpret-detail/:interpret_detail_id/delete')
  .put(InterpretController.deleteDetailInterpret);
routes
  .route('/interpret-detail/check-interpret')
  .get(InterpretController.CheckDetailInterpret);

module.exports = {
  prefix,
  routes,
};
