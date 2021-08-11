const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  partner_id: '{{#? PARTNERID}}',
  partner_name: '{{#? PARTNERNAME}}',
  phone_number: '{{#? PHONENUMBER}}',
  email: '{{#? EMAIL}}',
  country_id: '{{#? COUNTRYID}}',
  province_id: '{{#? PROVINCEID}}',
  ward_id: '{{#? WARDID}}',
  district_id: '{{#? DISTRICTID}}',
  address: '{{#? ADDRESS}}',
  fax: '{{#? FAX}}',
  tax_id: '{{#? TAXID}}',
  is_active: '{{#? ISACTIVE}}',
  bank_number: '{{#? BANKNUMBER}}',
  bank_account_name: '{{#? BANKACCOUNTNAME}}',
  bank_account_id: '{{#? BANKACCOUNTID}}',
  bank_name: '{{#? BANKNAME}}',
  bank_routing: '{{#? BANKROUTING}}',
  addressfull: '{{#? ADDRESSFULL}}',
  ower_name: '{{#? OWERNAME}}',
  ower_phone_1: '{{#? OWERPHONE1}}',
  ower_phone_2: '{{#? OWERPHONE2}}',
  ower_email: '{{#? OWEREMAIL}}',
  user_name: '{{#? USERNAME}}',
  password: '{{#? PASSWORD}}',
};

let transform = new Transform(template);

const list = (Partner = []) => {
  return transform.transform(Partner, [
    'partner_id',
    'partner_name',
    'phone_number',
    'email',
    'addressfull',
    'bank_name',
    'bank_account_name',
    'bank_account_id',
  ]);
};

const detail = (Partner = []) => {
  return transform.transform(Partner, [
    'partner_id',
    'partner_name',
    'phone_number',
    'email',
    'country_id',
    'province_id',
    'ward_id',
    'district_id',
    'address',
    'fax',
    'tax_id',
    'is_active',
    'bank_number',
    'bank_account_name',
    'bank_account_id',
    'bank_name',
    'bank_routing',
    'addressfull',
    'ower_name',
    'ower_phone_1',
    'ower_phone_2',
    'ower_email',
    'user_name',
    'password',
  ]);
};

module.exports = {
  list,
  detail,
};
