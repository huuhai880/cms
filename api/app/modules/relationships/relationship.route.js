const express = require('express');
const RelationshipController = require('./relationship.controller');

const routes = express.Router();

const prefix = '/relationships';
const validate = require('express-validation');
const rules = require('./relationship.rule');
// // List options position
// routes.route('/get-options').get(MainNumberController.getOptions);
///////list Relationships
routes.route('').get(RelationshipController.getRelationshipsList);
// /////////list Image by numer id
// routes.route('/:mainNumber_id/image-by-numerid').get(MainNumberController.getImageListByNum);
// routes.route('/partner').get(MainNumberController.getPartnersList);

////createOrupdate relationships
routes
  .route('')
  .post(
    validate(rules.createOrUpdateRelationship),
    RelationshipController.addRelationship
  );
///detail relationships
routes
  .route('/:relationships_id(\\d+)')
  .get(RelationshipController.detailRelationship);
////////detelte Relationships
routes
  .route('/:relationships_id/delete')
  .put(RelationshipController.deleteRelationship);
// check relationships
routes
  .route('/check-relationships')
  .get(RelationshipController.CheckRelationship);
module.exports = {
  prefix,
  routes,
};
