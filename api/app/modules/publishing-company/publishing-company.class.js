const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  publishing_company_id: '{{#? PUBLISHINGCOMPANYID}}',
  publishing_company_name: '{{#? PUBLISHINGCOMPANYNAME}}',
  logo_image: `${config.domain_cdn}{{LOGOIMAGE}}`,
  notes: '{{#? NOTES}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  publishing_company_quote: '{{#? PUBLISHINGCOMPANYQUOTE}}',
};

const list = (areas = []) => {
  let transform = new Transform(template);
  return transform.transform(areas, [
    'publishing_company_id',
    'publishing_company_name',
    'is_active',
    'created_date',
    'created_user',
  ]);
};

const detail = (values) => {
  let transform = new Transform(template);
  return transform.transform(values, [
    'publishing_company_id',
    'publishing_company_name',
    'notes',
    'logo_image',
    'is_active',
    'publishing_company_quote',
  ]);
};

module.exports = {
  list,
  detail,
};
