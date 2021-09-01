const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  letter_id: '{{#? LETTERID}}',
  letter: '{{#? LETTER}}',
  number: '{{#? NUMBER}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_vowel: '{{ISVOWEL ? 1 : 0}}',
  desc: '{{#? DESCRIPTION}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
};
let transform = new Transform(template);
const list = (users = []) => {
  return transform.transform(users, [
    'letter_id',
    'letter',
    'is_active',
    'number',
    'is_vowel',
    'desc',
  ]);
};

module.exports = {
  list,
};
