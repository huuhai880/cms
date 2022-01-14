const Transform = require('../../common/helpers/transform.helper');

const template = {
  product_id: '{{#? PRODUCTID}}',
  product_name: '{{#? PRODUCTNAME}}',
  customer_type_id: '{{#? CUSTOMERTYPEID}}',
  customer_type_name: '{{#? CUSTOMERTYPENAME}}',
  //discount
  discount_id: '{{#? DISCOUNTID}}',
  discount_code: '{{#? DISCOUNTCODE}}',
  is_percent_discount: '{{#? ISPERCENTDISCOUNT}}',
  is_money_discount: '{{#? ISMONEYDISCOUNT}}',
  discount_value: '{{#? DISCOUNTVALUE}}',
  is_all_product: '{{#? ISALLPRODUCT}}',
  is_appoint_product: '{{#? ISAPPOINTPRODUCT}}',
  is_all_customer_type: '{{#? ISALLCUSTOMERTYPE}}',
  is_app_point_customer_type: '{{#? ISAPPOINTCUSTOMERTYPE}}',
  is_apply_orther_discount: '{{#? ISAPPLYOTHERDISCOUNT}}',
  is_none_requirement: '{{#? ISNONEREQUIREMENT}}',
  is_mintotal_money: '{{#? ISMINTOTALMONEY}}',
  value_mintotal_money: '{{#? VALUEMINTOTALMONEY}}',
  is_min_product: '{{#? ISMINNUMPRODUCT}}',
  is_value_min_product: '{{#? VALUEMINNUMPRODUCT}}',
  discount_status: '{{#? DISCOUNTSTATUS}}',
  customertype_id: '{{#? CUSTOMERTYPEID}}',
  start_date: '{{#? STARTDATE}}',
  end_date:'{{#? ENDDATE}}',
  create_date:'{{#? CREATEDDATE}}',
  is_active:'{{#? ISACTIVE}}',
  
};



const optionsProduct = (data = []) => {
  let transform = new Transform(template);
  return transform.transform(data, ['product_id', 'product_name',]);
};
const optionsCustomer = (data = []) => {
  let transform = new Transform(template);
  return transform.transform(data, ['customer_type_id', 'customer_type_name']);
};

const list = (data = []) => {
  let transform = new Transform(template);
  return transform.transform(data, [
    'discount_id',
    'discount_code',
    'is_percent_discount',
    'is_money_discount',
    'discount_value',
    'start_date',
    'end_date',
    'create_date',

  ]);
};


module.exports = {
  optionsProduct,
  optionsCustomer,
  list

};
