const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  order_id: '{{#? ORDERID}}',
  order_no: '{{#? ORDERNO}}',
  order_date: '{{#? ORDERDATE}}',
  status: '{{STATUS ? 1 : 0}}',
  is_day: '{{ISDAY ? 1 : 0}}',
  is_month: '{{ISMONTH ? 1 : 0}}',
  is_year: '{{ISYEAR ? 1 : 0}}',
  order_total_money: '{{#? TOTALMONEY}}',
  order_total_discount: '{{#? TOTALDISCOUNT}}',
  order_total_sub: '{{#? SUBTOTAL}}',
  full_name: '{{#? FULLNAME}}',
  address: '{{#? ADDRESS}}',
  email: '{{#? EMAIL}}',
  phone_number: '{{#? PHONENUMBER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  order_detail_quantity: '{{#? QUANTITY}}',
  product_price: '{{#? PRICE}}',
  order_detail_total: '{{#? TOTALAMOUNT}}',
  product_name: '{{#? PRODUCTNAME}}',
};
let transform = new Transform(template);
const list = (users = []) => {
  return transform.transform(users, [
    'product_name',
    'order_no',
    'order_id',
    'order_date',
    'status',
    'order_total_sub',
    'full_name',
    'phone_number',
  ]);
};
const detailOrder = (users = []) => {
  return transform.transform(users, [
    'order_id',
    'order_no',
    'status',
    'order_total_money',
    'order_date',
    'full_name',
    'phone_number',
    'address',
    'email',
    'order_total_discount',
    'order_total_sub'
  ]);
};
const listProduct = (users = []) => {
  return transform.transform(users, [
    'order_detail_quantity',
    'product_price',
    'order_detail_total',
    'product_name'
  ]);
};
module.exports = {
  list,
  detailOrder,listProduct
};
