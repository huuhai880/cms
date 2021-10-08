const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  farmous_id: '{{#? FAMOUSID}}',
  farmous_name: '{{#? FAMOUSNAME}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  birthday: '{{#? BIRTHDAY}}',
  position: '{{#? POSITIONNAME}}',
  gender: '{{GENDER ? 1 : 0}}',

  short_desc: '{{#? SHORTDESCRIPTION}}',
  desc: '{{#? DESCRIPTION}}',
  image_avatar: [
    {
      '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  is_default: '{{ISDEFAULT ? 1 : 0}}',
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
    'farmous_id',
    'farmous_name',
    'is_active',
    'short_desc',
    'position',
    'birthday',
    'gender',
  ]);
};
const detail = (users = []) => {
  return transform.transform(users, [
    'farmous_id',
    'farmous_name',
    'is_active',
    'is_default',
    'short_desc',
    'desc',
    'position',
    'birthday',
    'image_avatar',
    'gender',
  ]);
};
module.exports = {
  list,
  detail,
};
