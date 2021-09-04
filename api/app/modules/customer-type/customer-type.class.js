const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  customer_type_id: '{{#? CUSTOMERTYPEID}}',
  customer_type_name: '{{#? CUSTOMERTYPENAME}}',
  description: '{{#? DESCRIPTION}}',
  order_index: '{{#? ORDERINDEX}}',
  is_default: '{{ISDEFAULT ? 1 : 0}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'customer_type_id',
    'customer_type_name',
    'order_index',
    'description',
    'is_default',
    'is_active',
  ]);
};

const list = (users = []) => {
  return transform.transform(users, [
    'customer_type_id',
    'customer_type_name',
    'order_index',
    'description',
    'is_default',
    'is_active',
  ]);
};

module.exports = {
  detail,
  list,
};
