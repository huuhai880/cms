const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  product_id: '{{#? PRODUCTID}}',
  product_category_id: '{{#? PRODUCTCATEGORYID}}',
  product_attribute_id: '{{#? PROATTRIBUTESID}}',

  category_name: '{{#? CATEGORYNAME}}',
  product_name: '{{#? PRODUCTNAME}}',
  product_name_show_web: '{{#? PRODUCTNAMESHOWWEB}}',
  brief_desc: '{{#? BRIEFDESCRIPTION}}',
  order_index: '{{#? ORDERINDEX}}',

  is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  price: '{{PRICE ? PRICE : 0}}',

  attributes_group_id: '{{#? ATTRIBUTESGROUPID}}',
  attributes_group_name: '{{#? ATTRIBUTESGROUPNAME}}',
  parent_interpret_detail_name: '{{#? PARENTINTERPRETDETAILNAME}}',
  interpret_detail_parentname: '{{#? PARENTNAME}}',
  interpret_detail_short_content: '{{#? SHORTCONTENT}}',
  interpret_detail_full_content: '{{#? FULLCONTENT}}',
  interpret_id: '{{#? INTERPRETID}}',
  formula_id: '{{#? FORMULAID}}',
  main_number_id: '{{#? MAINNUMBERID}}',
  is_master: '{{ISMASTER ? 1 : 0}}',
  interpret_detail_id: '{{#? INTERPRETDETAILID}}',
  interpret_detail_name: '{{#? INTERPRETDETAILNAME}}',
  attribute_id: '{{#? ATTRIBUTEID}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  url_product: '{{#? URLPRODUCT}}',
  id: '{{#? ID}}',
  name: '{{#? NAME}}',
  is_default: '{{ISDEFAULT ? 1 : 0}}',
  picture_url: [
    {
      '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  product_content_detail: '{{#? PRODUCTCONTENTDETAIL}}',
  short_description: '{{#? SHORTDESCRIPTION}}',
  is_web_view: '{{ISWEBVIEW ? 1 : 0}}',
  is_show_menu: '{{ISSHOWMENU ? 1 : 0}}',
  text_url: '{{#? TEXTURL}}',
  url: '{{#? URL}}',
  is_show_search_result: '{{ISSHOWSEARCHRESULT ? 1 : 0}}',
  is_selected: '{{ISSELECTED ? 1 : 0}}',

  page_id: '{{#? PAGEID}}',
  page_name: '{{#? PAGENAME}}',
  group_name: '{{#? GROUPNAME}}',
  attributes_id: '{{#? ATTRIBUTEID}}',
  attributes_name: '{{#? ATTRIBUTENAME}}',
  showIndex: '{{#? ORDERINDEXINTERPRET}}',
  product_page_id:'{{#? PRODUCTPAGEID}}',
  link_landing_page:'{{#? LINKLANDINGPAGE}}',
  is_new_comment: '{{ISNEWCOMMENT ? 1 : 0}}',
  date_sort: '{{#? CREATEDDATE}}',
  order_index_page: '{{#? ORDERINDEXPAGE}}',
  page_type: '{{#? PAGETYPE}}'
};

let transform = new Transform(template);

const detail = (product) => {
  return Object.keys(product).length > 0
    ? transform.transform(product, [
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
      'is_show_menu',
      'link_landing_page'
    ])
    : null;
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
    'is_web_view',
    'is_new_comment'
  ]);
};

const listPicture = (pictures = []) => {
  return transform.transform(pictures, [
    'product_id',
    'picture_url',
    'is_default',
  ]);
};

const options = (list = []) => {
  return transform.transform(list, ['id', 'name']);
};

const listAttributesGroup = (list = []) => {
  return transform.transform(list, [
    'attributes_group_id',
    'attributes_group_name',
  ]);
};

const listInterpret = (list = []) => {
  return transform.transform(list, [
    'attributes_group_id',
    'product_attribute_id',
    'attribute_id',
    'attribute_name',
    'interpret_id',
    'interpret_detail_id',
    'interpret_detail_name',
    'is_active',
    'order_index',
    'brief_desc',
    'text_url',
    'url',
    'is_show_search_result',
    'is_selected',
    'date_sort'
  ]);
};

const listAttributes = (list = []) => {
  return transform.transform(list, [
    'attributes_group_id',
    'product_id',
  ]);
};
const detailInterpret = (list = []) => {
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


const listInterpretDetail = (users = []) => {
  return transform.transform(users, [
    'interpret_detail_id',
    'interpret_detail_name',
    'interpret_detail_parentname',
    'product_attribute_id',
    'interpret_detail_short_content',
    'is_active',
    'interpret_id',
    'parent_id',
    'order_index',
    'parent_interpret_detail_name',
    'text_url',
    'url',
    'is_show_search_result',
    'is_selected'
  ]);
};

const list_page_product = (users = []) => {
  return transform.transform(users, [
    'page_id',
    'page_name',
    'order_index_page',
    'page_type'
  ]);
};

const listAttGroupProductPage = (users = []) => {
  return transform.transform(users, [
    'page_id',
    'attributes_group_id',
    'group_name',
    'order_index',
  ]);
}


const listInterPertPage = (users = []) => {
  return transform.transform(users, [
    'product_page_id',
    'interpret_detail_id',
    'interpret_id',
    'attributes_group_id',
    'attributes_id',
    'attributes_name',
    'interpret_detail_name',
    'showIndex',
    'page_id'
  ]);
}

const list_Interpert = (users = []) => {
  return transform.transform(users, [
    'interpret_detail_id',
    'interpret_id',
    'attributes_group_id',
    'attributes_id',
    'attributes_name',
    'interpret_detail_name',
  ]);
}

const listInterpretSpecialOfPage = (list = []) => {
    return transform.transform(list, [
      'interpret_detail_id',
      'interpret_id',
      'attributes_group_id',
      'attributes_id',
      'page_id',
      'product_id',
    ]);
  }

module.exports = {
  options,
  detail,
  list,
  listPicture,
  listAttributes,
  listAttributesGroup,
  listInterpret,
  listInterpretDetail,
  detailInterpret,
  list_page_product,
  listAttGroupProductPage,
  listInterPertPage,
  list_Interpert,
  listInterpretSpecialOfPage
};
