const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'plan_id': '{{#? PLANID}}',
  'plan_category_id': '{{#? PLANCATEGORYID}}',
  'plan_category_name': '{{#? CATEGORYNAME}}',
  'plan_date': '{{#? PLANDATE}}',
  'plan_title': '{{#? PLANTITLE}}',
  'meta_keywords': '{{#? METAKEYWORDS}}',
  'meta_desciptions': '{{#? METADESCRIPTIONS}}',
  'meta_title': '{{#? METATITLE}}',
  'seo_name': '{{#? SEONAME}}',
  'plan_tag': '{{#? PLANTAG}}',
  'description': '{{#? DESCRIPTION}}',
  'short_description': '{{#? SHORTDESCRIPTION}}',
  'content': '{{#? CONTENT}}',
  'image_url': `${config.domain_cdn}{{IMAGEURL}}`,
  'author_fullname': '{{#? AUTHORFULLNAME}}',
  'is_show_home': '{{#? ISSHOWHOME}}',
  'is_active': '{{#? ISACTIVE}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'author_id': '{{#? AUTHORID}}',
  'product_id': '{{#? PRODUCTID}}',
  'attribute_content': '{{#? ATTRIBUTECONTENT}}'
};

let transform = new Transform(template);

const detail = (author) => {
  return transform.transform(author, [
    'plan_id','plan_title', 'plan_category_id', 'description', 'image_url', 'is_active', 'attribute_content', 'content', 'seo_name', 'meta_keywords'
  ]);
};

const list = (plan = []) => {
  return transform.transform(plan, [
    'plan_id','plan_title', 'plan_category_name', 'is_active', 'created_user', 'created_date'
  ]);
};

module.exports = {
  detail,
  list
};
