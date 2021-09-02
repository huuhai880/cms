const express = require('express');
const LetterController = require('./letter.controller');

const routes = express.Router();

const prefix = '/letter';
const validate = require('express-validation');
const rules = require('./letter.rule');
// // List options position
// routes.route('/get-options').get(MainNumberController.getOptions);
///////list letter
routes.route('').get(LetterController.getLettersList);
// /////////list Image by numer id
// routes.route('/:mainNumber_id/image-by-numerid').get(MainNumberController.getImageListByNum);
// routes.route('/partner').get(MainNumberController.getPartnersList);

//////createOrupdate
routes
  .route('')
  .post(validate(rules.createOrUpdateLetter), LetterController.addLetter);
///detail letter
routes
  .route('/:letter_id(\\d+)')
  .get(LetterController.detailLetter);
// ////////detelte letter
routes.route('/:letter_id/delete').put(LetterController.deleteLetter);
// check email
routes
  .route('/check-letter')
  .get(LetterController.CheckLetter);
module.exports = {
  prefix,
  routes,
};
