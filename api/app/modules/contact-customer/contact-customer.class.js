const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  contact_id: '{{#? CONTACTID}}',
  full_name: '{{#? FULLNAME}}',
  email: '{{#? EMAIL}}',
  phone_number: '{{#? PHONENUMBER}}',
  content: '{{#? CONTENT}}',
  nick_name: '{{#? NICKNAME}}',
  key_contact: '{{#? KEYCONTACT}}',
  service_id: '{{#? SERVICEID}}',
  service_name: '{{#? SERVICENAME}}',
  // contact_id: '{{#? CONTACTID}}',
  content: '{{#? CONTENT}}',

  is_active: '{{ISACTIVE ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (author) => {
  return transform.transform(author, [
    'contact_id',
    'full_name',
    'nick_name',
    'email',
    'content',
    'key_contact',
    'phone_number',
    'service_id',
    'service_name',
    'is_active',
    'content',
  ]);
};

const list = (plan = []) => {
  return transform.transform(plan, [
    'contact_id',
    'full_name',
    'phone_number',
    'email',
    'key_contact',
    'service_name',
    'is_active',
    'content',
  ]);
};

module.exports = {
  detail,
  list,
};
