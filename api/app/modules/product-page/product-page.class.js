const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  product_page_id: '{{#? PAGEID}}',
  title_page: '{{#? TITLEPAGE}}',
  interpret_detail_id: '{{#? INTERPRETDETAILID}}',
  attributes_group_id: '{{#? ATTRIBUTESGROUPID}}',
  interpret_id: '{{#? INTERPRETID}}',
  attributes_id: '{{#? ATTRIBUTEID}}',
  attributes_name: '{{#? ATTRIBUTENAME}}',
  interpret_detail_name: '{{#? INTERPRETDETAILNAME}}',

};
let transform = new Transform(template);
const list = (users = []) => {
  return transform.transform(users, [
    'product_page_id',
    'title_page',
  ]);
};
const list_interpretdetail = (users = []) => {
  return transform.transform(users, [
    'interpret_detail_id',
    'interpret_id',
    'attributes_group_id',
    'attributes_id',
    'attributes_name',
    'interpret_detail_name',
  ]);
};






module.exports = {
  list,
  list_interpretdetail,
};
