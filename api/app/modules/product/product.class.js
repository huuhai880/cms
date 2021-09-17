const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  product_id: '{{#? PRODUCTID}}',
  product_category_id: '{{#? PRODUCTCATEGORYID}}',
  category_name: '{{#? CATEGORYNAME}}',
  product_name: '{{#? PRODUCTNAME}}',
  product_name_show_web: '{{#? PRODUCTNAMESHOWWEB}}',
  is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  price: '{{PRICE ? PRICE : 0}}',

  attributes_group_id: "{{#? ATTRIBUTESGROUPID}}",
  attributes_group_name: "{{#? ATTRIBUTESGROUPNAME}}",

  interpret_id : "{{#? INTERPRETID}}",
  formula_id : "{{#? FORMULAID}}",
  main_number_id: "{{#? MAINNUMBERID}}",
  is_master: "{{ISMASTER ? 1 : 0}}",
  interpret_detail_id : "{{#? INTERPRETDETAILID}}",
  interpret_detail_name : "{{#? INTERPRETDETAILNAME}}",
  attribute_id : "{{#? ATTRIBUTEID}}",
  attribute_name : "{{#? ATTRIBUTENAME}}",
  url_product : "{{#? URLPRODUCT}}",
  id: '{{#? ID}}',
  name: '{{#? NAME}}',
  is_default: "{{ISDEFAULT ? 1 : 0}}",
  picture_url: [
    {
      '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  product_content_detail: "{{#? PRODUCTCONTENTDETAIL}}",
  short_description: "{{#? SHORTDESCRIPTION}}",
  is_web_view: "{{ISWEBVIEW ? 1 : 0}}",
  is_show_menu: "{{ISSHOWMENU ? 1 : 0}}",
  text_url: "{{#? TEXTURL}}",
  url: '{{#? URL}}',
  is_show_search_result: '{{ISSHOWSEARCHRESULT ? 1 : 0}}'
};

let transform = new Transform(template);

const detail = (product) => {
  return Object.keys(product).length > 0 ? transform.transform(product, [
    'product_id',
    'product_category_id',
    'product_name',
    'product_name_show_web',
    'product_content_detail',
    'short_description',
    'is_show_web',
    'is_active',
    'url_product',
    'is_web_view',
    'is_show_menu'
  ]) : null;
};

const list = (products = []) => {
  return transform.transform(products, [
    'product_id',
    'product_category_id',
    'category_name',
    'product_name_show_web',
    'product_name',
    'price',
    'is_show_web',
    'is_active',
    'is_show_menu',
    'is_web_view'
  ]);
};

const listPicture = (pictures = []) => {
  return transform.transform(pictures, [
    'product_id',
    'picture_url',
    'is_default'
  ]);
};

const options = (list = []) => {
  return transform.transform(list, ['id', 'name']);
};

const listAttributesGroup = (list = []) => {
  return transform.transform(list, [
    'attributes_group_id',
    'attributes_group_name'
  ]);
};

const listInterpret = (list = []) => {
  return transform.transform(list, [
    'attributes_group_id',
    'attribute_id',
    'attribute_name',
    'interpret_id',
    'interpret_detail_id',
    'interpret_detail_name'
  ]);
};


const listAttributes = (list = []) => {
  return transform.transform(list, [
    'attributes_group_id',
    'interpret_id',
    'interpret_detail_id',
    'product_id',
    'attribute_id',
    'interpret_detail_name',
    'text_url',
    'url',
    'is_show_search_result'
  ]);
};


module.exports = {
  options,
  detail,
  list,
  listPicture,
  listAttributes,
  listAttributesGroup,
  listInterpret
};
