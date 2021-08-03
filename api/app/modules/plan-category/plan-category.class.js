const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  "plan_category_id" :'{{#? PLANCATEGORYID}}',
  "category_name": '{{#? CATEGORYNAME}}',
  "name_show_web": '{{#? NAMESHOWWEB}}',
  "seo_name": '{{#? SEONAME}}',
  "picture_url": `${config.domain_cdn}{{PICTUREURL}}`,
  "parent_id": '{{#? PARENTID}}',
  "is_show_web": '{{ISSHOWWEB ? 1 : 0}}',
  "description": '{{#? DESCRIPTION}}',
  "is_active": '{{ISACTIVE ? 1 : 0}}',
  "created_user": '{{#? CREATEDUSER}}',
  "created_date": '{{#? CREATEDDATE}}',
  "updated_user": '{{#? UPDATEDUSER}}',
  "updated_date": '{{#? UPDATEDDATE}}',
  "is_deleted": '{{ISDELETED ? 1 : 0}}',
  "deleted_user": '{{#? DELETEDUSER}}',
  "deleted_date": '{{#? DELETEDDATE}}',
  "meta_keywords": '{{#? METAKEYWORDS}}',
  "meta_descriptions": '{{#? METADESCRIPTIONS}}',
  "meta_title": '{{#? METATITLE}}',
  "banner_url": '{{#? BANNERURL}}',
  "parent_name": '{{#? PARENTNAME}}'
};

const templateOption = {
  'id': '{{#? PLANCATEGORYID}}',
  'name': '{{#? CATEGORYNAME}}',
  'parent_id': '{{#? PARENTID}}'
};

let transform = new Transform(template);

const list = (planCategory = []) => {
  return transform.transform(planCategory, [
    'plan_category_id','category_name', 'description', 'is_active', 'created_user', 'created_date'
  ]);
};

const options = (planCategory = []) =>{
  let transform = new Transform(templateOption);
  return transform.transform(planCategory, [
    'id','name', 'parent_id'
  ]);
}

const detail = (planCategory = []) => {
  return transform.transform(planCategory, [
    'plan_category_id', 'category_name', 'seo_name', 'description', 'is_active', 'meta_keywords'
  ]);
};

module.exports = {
  list,
  options,
  detail
};
