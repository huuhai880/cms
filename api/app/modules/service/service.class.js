const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'service_id': '{{#? SERVICEID}}',
  'service_name': '{{#? SERVICENAME}}',
  'content': '{{#? CONTENT}}',
  'image': `${config.domain_cdn}{{IMAGE}}`,
  'is_active': '{{#? ISACTIVE}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
};


let transform = new Transform(template);

const detail = (service) => {
  return transform.transform(service, [
    'service_id', 'service_name','content','image', 'is_active'
  ]);
};

const list = (services = []) => {
  return transform.transform(services, [
    'service_id', 'service_name','created_user', 'created_date','phone_number','is_active'
  ]);
};



module.exports = {
  detail,
  list
};
