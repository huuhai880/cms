const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  param_type_id: '{{#? PARAMDOBID}}',
  param_type: '{{#? DOBTYPE}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_day: '{{ISDAY ? 1 : 0}}',
  is_month: '{{ISMONTH ? 1 : 0}}',
  is_year: '{{ISYEAR ? 1 : 0}}',
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
    'param_type_id',
    'param_type',
    'is_active',
    'is_day',
    'is_month',
    'is_year',
  ]);
};

module.exports = {
  list
};
