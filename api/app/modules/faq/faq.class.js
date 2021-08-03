const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'faq_id': '{{#? FAQSID}}',
  'question': '{{#? QUESTION}}',
  'answer': '{{#? ANSWER}}',
  'is_active': '{{#? ISACTIVE}}',
  'faq_type': '{{#? FAQSTYPE}}',
  'order_index': '{{#? ORDERINDEX}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}'
};


let transform = new Transform(template);

const detail = (service) => {
  return transform.transform(service, [
    'faq_id', 'question','answer','faq_type', 'is_active','order_index'
  ]);
};

const list = (services = []) => {
  return transform.transform(services, [
    'faq_id', 'question','answer','created_user', 'created_date','is_active','faq_type', 'order_index'
  ]);
};

module.exports = {
  detail,
  list
};
