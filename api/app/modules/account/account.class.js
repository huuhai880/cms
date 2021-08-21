const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  member_id: '{{#? MEMBERID}}',
  user_name: '{{#? USERNAME}}',
  pass_word: '{{#? PASSWORD}}',
  customer_code: '{{#? CUSTOMERCODE}}',
  type_register: '{{#? TYPEREGISTER}}',
  register_date: '{{#? REGISTERDATE}}',
  image_avatar: [
    {
      '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  id_card_front_image: [
    {
      '{{#if IDCARDFRONTSIDE}}': `${config.domain_cdn}{{IDCARDFRONTSIDE}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  id_card_back_image: [
    {
      '{{#if IDCARDBACKSIDE}}': `${config.domain_cdn}{{IDCARDBACKSIDE}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  live_image: [
    {
      '{{#if LIVEIMAGE}}': `${config.domain_cdn}{{LIVEIMAGE}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  full_name: '{{#? FULLNAME}}',
  nick_name: '{{#? NICKNAME}}',
  birth_day: '{{#? BIRTHDAY}}',
  gender: '{{GENDER ? 1 : 0}}',
  marital_status: '{{MARITALSTATUS  ? 1 : 0}}',
  phone_number: '{{#? PHONENUMBER}}',
  email: '{{#? EMAIL}}',
  id_card: '{{#? IDCARD}}',
  id_card_date: '{{#? IDCARDDATE}}',
  id_card_place: '{{#? IDCARDPLACE}}',
  address: '{{#? ADDRESS}}',
  address_full: '{{#? ADDRESSFULL}}',
  province_id: '{{#? PROVINCEID}}',
  province_name: '{{#? PROVINCENAME}}',
  district_id: '{{#? DISTRICTID}}',
  district_name: '{{#? DISTRICTNAME}}',
  country_id: '{{#? COUNTRYID}}',
  country_name: '{{#? COUNTRYNAME}}',
  ward_id: '{{#? WARDID}}',
  ward_name: '{{#? WARDNAME}}',
  is_confirm: '{{ISCONFIRM ? 1 : 0}}',
  is_notification: '{{ISNOTIFICATION ? 1 : 0}}',
  is_can_email: '{{ISCANEMAIL ? 1 : 0}}',
  is_can_sms_or_phone: '{{ISCANSMSORPHONE ? 1 : 0}}',
  is_system: '{{ISSYSTEM ? 1 : 0}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  gen_customer_code: '{{#? GEN_CUSTOMER_CODE}}',
};

let transform = new Transform(template);

const detail = (user) => {
  return transform.transform(user, [
    'member_id',
    'user_name',
    'pass_word',
    'customer_code',
    'register_date',
    'image_avatar',
    'full_name',
    'nick_name',
    'birth_day',
    'gender',
    'marital_status',
    'phone_number',
    'email',
    'live_image',
    'id_card',
    'id_card_date',
    'id_card_place',
    'address',
    'province_id',
    'id_card_front_image',
    'id_card_back_image',
    'district_id',
    'ward_id',
    'is_active',
  ]);
};
const genCode = (user) => {
  return transform.transform(user, ['gen_customer_code']);
};
const list = (users = []) => {
  return transform.transform(users, [
    'member_id',
    'customer_code',
    'full_name',
    'gender',
    'birth_day',
    'phone_number',
    'address_full',
    'type_register',
    'is_active',
  ]);
};
// options
const templateOptions = {
  id: '{{#? ID}}',
  name: '{{#? NAME}}',
};

const options = (userGroups = []) => {
  let transform = new Transform(templateOptions);
  return transform.transform(userGroups, ['id', 'name']);
};
module.exports = {
  detail,
  list,
  options,
  genCode,
};
