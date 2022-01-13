const Transform = require('../../common/helpers/transform.helper');

const template = {
  'product_id': '{{#? PRODUCTID}}',
  'product_name': '{{#? PRODUCTNAME}}',
  'customer_type_id': '{{#? CUSTOMERTYPEID}}',
  'customer_type_name': '{{#? CUSTOMERTYPENAME}}',

};



const optionsProduct = (data = []) => {
  let transform = new Transform(template);
  return transform.transform(data, ['product_id', 'product_name',]);
};
const optionsCustomer = (data = []) => {
  let transform = new Transform(template);
  return transform.transform(data, ['customer_type_id', 'customer_type_name']);
};

module.exports = {
  optionsProduct,
  optionsCustomer

};
