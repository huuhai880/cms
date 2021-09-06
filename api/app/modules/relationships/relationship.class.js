const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  relationship_id: '{{#? RELATIONSHIPID}}',
  relationship: '{{#? RELATIONSHIP}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  note: '{{#? NOTE}}',
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
    'relationship_id',
    'relationship',
    'is_active',
    'note',
  ]);
};

module.exports = {
  list,
};
