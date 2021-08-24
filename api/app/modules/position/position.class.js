const Transform = require('../../common/helpers/transform.helper');

const template = {
  position_id: '{{#? POSITIONID}}',
  position_name: '{{#? POSITIONNAME}}',
  priority: '{{#? PRIORITY}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
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
    'position_id',
    'position_name',
    'priority',
    'is_active',
    'created_user',
    'created_date',
  ]);
};
const detail = (users = []) => {
  return transform.transform(users, [
    'position_id',
    'position_name',
    'is_active',
  ]);
};
module.exports = { list, detail };
