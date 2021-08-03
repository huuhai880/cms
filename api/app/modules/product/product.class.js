const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  product_id: '{{#? PRODUCTID}}',
  product_category_id: '{{#? PRODUCTCATEGORYID}}',
  category_name: '{{#? CATEGORYNAME}}',
  author_id: '{{#? AUTHORID}}',
  publishing_company_id: '{{#? PUBLISHINGCOMPANYID}}',
  release_time: '{{#? RELEASETIME}}',
  product_code: '{{#? PRODUCTCODE}}',
  product_name: '{{#? PRODUCTNAME}}',
  product_name_show_web: '{{#? PRODUCTNAMESHOWWEB}}',
  product_content_detail: '{{#? PRODUCTCONTENTDETAIL}}',
  short_description: '{{#? SHORTDESCRIPTION}}',
  video_url: '{{#? VIDEOURL}}',
  is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
  is_show_home: '{{ISSHOWHOME ? 1 : 0}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{ISDELETED ? 1 : 0}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',

  product_related_id: '{{#? PRODUCTRELATEDID}}',
  publishing_company: '{{#? PUBLISHINGCOMPANY}}',

  //atrribute value
  // product_attribute_values_id: '{{#? PRODUCTATTRIBUTEVALUESID}}',
  // product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
  // attribute_name: '{{#? ATTRIBUTENAME}}',
  // attribute_values: '{{#? ATTRIBUTEVALUES}}',
  // product_id: '{{#? PRODUCTID}}',
  // unit_id: '{{#? UNITID}}',
};
const detail = (product) => {
  let transform = new Transform(template);

  return transform.transform(product, [
    'product_id',
    'product_category_id',
    'author_id',
    'publishing_company_id',
    'release_time',
    'category_name',
    'product_code',
    'product_name',
    'product_name_show_web',
    'product_content_detail',
    'short_description',
    'video_url',
    'is_show_web',
    'is_active',
    'created_date',
    'is_sell_well',
    'is_show_home',
    'publishing_company',

    //atrribute value
    // 'product_attribute_values_id',
    // 'product_attribute_id',
    // 'attribute_name',
    // 'attribute_values',
    // 'product_id',
    // 'unit_id',
  ]);
};

const proAtributteValuesTemplate = {
  product_attribute_values_id: '{{#? PRODUCTATTRIBUTEVALUESID}}',
  product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  attribute_values: '{{#? ATTRIBUTEVALUES}}',
  product_id: '{{#? PRODUCTID}}',
  unit_id: '{{#? UNITID}}',
};
const proAttributeValues = (data) => {
  let transform = new Transform(proAtributteValuesTemplate);
  return transform.transform(data, [
    'product_attribute_values_id',
    'product_attribute_id',
    'attribute_name',
    'attribute_values',
    'product_id',
    'unit_id',
  ]);
};

const list = (products = []) => {
  let transform = new Transform(template);

  return transform.transform(products, [
    'product_id',
    'manufacturer_id',
    'manufacturer_name',
    'product_category_id',
    'category_name',
    'product_name_show_web',
    'product_code',
    'product_name',
    'product_imei',
    'model_id',
    'model_name',
    'origin_id',
    'origin_name',
    'quantity',
    'price',
    'is_show_web',
    'is_service',
    'is_active',
    'created_date',
    'status_product_id',
    'status_product_name',
    'view',
    'add',
    'edit',
    'del',
    'is_amount_days',
    'is_session',
    'values_in',
  ]);
};
const listProductRelated = (products = []) => {
  let transform = new Transform(template);

  return transform.transform(products, [
    'product_id',
    'manufacturer_id',
    'manufacturer_name',
    'product_category_id',
    'category_name',
    'product_name_show_web',
    'product_code',
    'product_name',
    'product_imei',
    'model_id',
    'model_name',
    'origin_id',
    'origin_name',
    'quantity',
    'price',
    'is_show_web',
    'is_service',
    'is_active',
    'created_date',
    'status_product_id',
    'status_product_name',
    'view',
    'add',
    'edit',
    'del',
    'is_amount_days',
    'is_session',
    'values_in',
    'product_related_id',
  ]);
};

const templateService = {
  product_id: '{{#? PRODUCTID}}',
  product_service_id: '{{#? PRODUCTSERVICESID}}',
  category_name: '{{#? CATEGORYNAME}}',
  pt_level_id: '{{#? PTLEVELID}}',
  level_name: '{{#? LEVELNAME}}',
  is_amount_days: '{{ISAMOUNTDAYS ? 1 : 0}}',
  is_session: '{{ISSESSION ? 1 : 0}}',
  time_limit: '{{#? TIMELIMIT}}',
  values_in: '{{#? VALUESIN}}',
  time_per_session: '{{#? TIMEPERSESSION}}',
  is_freeze: '{{ISFREEZE ? 1 : 0}}',
  is_tranfer: '{{ISTRANFER ? 1 : 0}}',
  from_hour: '{{#? FROMHOURS}}',
  to_hour: '{{#? TOHOURS}}',
  is_product_off_peak: '{{ISPRODUCTOFFPEAK ? 1 : 0}}',
};
const detailService = (service) => {
  let transform = new Transform(templateService);

  return transform.transform(service, [
    'product_id',
    'product_service_id',
    'pt_level_id',
    'level_name',
    'is_amount_days',
    'is_session',
    'is_session',
    'values_in',
    'time_limit',
    'time_per_session',
    'is_freeze',
    'is_tranfer',
    'from_hour',
    'to_hour',
    'is_product_off_peak',
  ]);
};

const templatePicture = {
  product_picture_id: '{{#? PRODUCTPICTUREID}}',
  picture_url: `${config.domain_cdn}{{PICTUREURL}}`,
  picture_alias: '{{#? PICTUREALIAS}}',
  is_default: '{{ISDEFAULT ? 1 : 0}}',
  product_id: '{{#? PRODUCTID}}',
};
const listPicture = (pictures = []) => {
  let transform = new Transform(templatePicture);
  return transform.transform(pictures, [
    'product_id',
    'picture_url',
    'picture_alias',
    'is_default',
    'product_picture_id',
  ]);
};

const templateBussiness = {
  product_id: '{{#? PRODUCTID}}',
  business_id: '{{#? BUSINESSID}}',
  business_name: '{{#? BUSINESSNAME}}',
};
const listBussiness = (business = []) => {
  let transform = new Transform(templateBussiness);
  return transform.transform(business, [
    'product_id',
    'business_id',
    'business_name',
  ]);
};
const templateAttributeValues = {
  product_attribute_values_id: '{{#? PRODUCTATTRIBUTEVALUESID}}',
  product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  attribute_values: '{{#? ATTRIBUTEVALUES}}',
  product_id: '{{#? PRODUCTID}}',
  unit_id: '{{#? UNITID}}',
  unit_name: '{{#? UNITNAME}}',
};
const listAttributeValues = (attributeValues = []) => {
  let transform = new Transform(templateAttributeValues);
  return transform.transform(attributeValues, [
    'product_id',
    'product_attribute_values_id',
    'product_attribute_id',
    'attribute_name',
    'attribute_values',
    'unit_id',
    'unit_name',
  ]);
};
const templatePrice = {
  price_id: '{{#? PRICEID}}',
  output_type_id: '{{#? OUTPUTTYPEID}}',
  output_type_name: '{{#? OUTPUTTYPENAME}}',
  price: '{{#? PRICE}}',
  price_vat: '{{#? PRICEVAT}}',
};
const listPrice = (price = []) => {
  let transform = new Transform(templatePrice);
  return transform.transform(price, [
    'price_id',
    'output_type_id',
    'output_type_name',
    'price',
    'price_vat',
  ]);
};
const templateOptions = {
  id: '{{#? ID}}',
  name: '{{#? NAME}}',
};

const options = (manufacturer = []) => {
  let transform = new Transform(templateOptions);

  return transform.transform(manufacturer, ['id', 'name']);
};

const templateQRList = {
  news_id: '{{#? NEWSID}}',
  news_title: '{{#? NEWSTITLE}}',
};
const qrList = (values) => {
  let transform = new Transform(templateQRList);
  return transform.transform(values, ['news_id', 'news_title']);
};

module.exports = {
  options,
  detail,
  list,
  listProductRelated,
  detailService,
  listPicture,
  listBussiness,
  listPrice,
  listAttributeValues,
  proAttributeValues,
  qrList,
};
