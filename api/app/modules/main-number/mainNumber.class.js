const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  main_number_id: '{{#? MAINNUMBERID}}',
  main_number_images_id: '{{#? IMAGESID}}',
  main_number: '{{#? MAINNUMBER}}',
  partner_id: '{{#? PARTNERID}}',
  partner_name: '{{#? PARTNERNAME}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_default: '{{ISDEFAULT ? 1 : 0}}',
  img_is_active: '{{ISACTIVE ? 1 : 0}}',
  img_is_default: '{{ISDEFAULT ? 1 : 0}}', 
  main_number_images_url: [
    {
      '{{#if URLIMAGES}}': `${config.domain_cdn}{{URLIMAGES}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  main_number_desc: '{{#? DESCRIPTION}}',
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
    'main_number_id',
    'main_number',
    'is_active',
    'main_number_desc',
  ]);
};
const detail = (users = []) => {
  return transform.transform(users, [
    'main_number_id',
    'main_number',
    'is_active',
    'main_number_desc',
  ]);
};
const imgList = (users = []) => {
  return transform.transform(users, [
    'partner_id',
    'partner_name',
    'main_number_images_url',
    'img_is_default',
    'img_is_active',
  ]);
};

const partnerList = (users = []) => {
  return transform.transform(users, ['partner_name', 'partner_id']);
};
module.exports = {
  list,
  detail,
  imgList,
  partnerList,
};
