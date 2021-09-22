const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  product_category_id: '{{#? PRODUCTCATEGORYID}}',
  category_name: '{{#? CATEGORYNAME}}',
  is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
  name_show_web: '{{#? NAMESHOWWEB}}',
  seo_name: '{{#? SEONAME}}',
  meta_descriptions: '{{#? METADESCRIPTIONS}}',
  meta_keywords: '{{#? METAKEYWORDS}}',
  parent_id: '{{#? PARENTID}}',
  parent_name: '{{#? PARENTNAME}}',
  company_id: '{{#? COMPANYID}}',
  company_name: '{{#? COMPANYNAME}}',
  description: '{{#? DESCRIPTIONS}}',
  created_user: '{{#? CREATEDUSER}}',
  created_full_name: '{{#? CREATEDFULLNAME}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  view_function_id: '{{#? VIEWFUNCTIONID}}',
  add_function_id: '{{#? ADDFUNCTIONID}}',
  edit_function_id: '{{#? EDITFUNCTIONID}}',
  delete_function_id: '{{#? DELETEFUNCTIONID}}',
  banner_url: [
    {
      '{{#if BANNERURL}}': `${config.domain_cdn}{{BANNERURL}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  // banner_url: `${config.domain_cdn}{{BANNERURL}}`,
  result: '{{#? RESULT}}',
  table_used: '{{#? TABLEUSED}}',
  product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  unit_id: '{{#? UNITID}}',
  unit_name: '{{#? UNITNAME}}',
  created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'product_category_id',
    'category_name',
    'is_show_web',
    'name_show_web',
    'seo_name',
    'meta_descriptions',
    'meta_keywords',
    'parent_id',
    'company_id',
    'is_active',
    'description',
    'banner_url',
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'product_category_id',
    'category_name',
    'name_show_web',
    'seo_name',
    'parent_name',
    'company_name',
    'created_full_name',
    'created_date',
    'is_active',
    'is_show_web'
  ]);
};
const listAttributeByCategory = (areas = []) => {
  return transform.transform(areas, [
    'product_attribute_id',
    'attribute_name',
    'unit_id',
    'unit_name',
  ]);
};

const detailUsed = (used = []) => {
  return transform.transform(used, ['result', 'table_used']);
};

// opt
// options
const templateOptions = {
  id: '{{#? ID}}',
  name: '{{#? NAME}}',
  parent_id: '{{#? PARENTID}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name', 'parent_id']);
};

const templateAttributeOption = {
  porduct_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  attribute_value: '{{#? ATTRIBUTEVALUES}}',
  attribute_value_id: '{{#? ATTRIBUTEVALUESID}}',
  product_attribute_value_id: '{{#? PRODUCTATTRIBUTEVALUESID}}',
  unit_id: '{{#? UNITID}}',
};
const attributeOption = (data = []) => {
  let transform = new Transform(templateAttributeOption);
  return transform.transform(data, [
    'porduct_attribute_id',
    'attribute_name',
    'attribute_value',
    'attribute_value_id',
    'unit_id',
  ]);
};

const attributeSelectedOption = (data = []) => {
  let transform = new Transform(templateAttributeOption);
  return transform.transform(data, [
    'porduct_attribute_id',
    'attribute_name',
    'attribute_value',
    'product_attribute_value_id',
    'unit_id',
  ]);
};

module.exports = {
  list,
  detail,
  detailUsed,
  options,
  listAttributeByCategory,
  attributeOption,
  attributeSelectedOption,
};
