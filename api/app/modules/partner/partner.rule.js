const Joi = require('joi');

const partnerCreateOrUpdate = {
  partner_id: Joi.number().allow('', null),
  partner_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  email: Joi.string().allow('', null),
  country_id: Joi.number().allow('', null),
  province_id: Joi.number().allow('', null),
  ward_id: Joi.number().allow('', null),
  district_id: Joi.number().allow('', null),
  address: Joi.string().allow('', null),
  fax: Joi.string().allow('', null),
  tax_id: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1),
  bank_number: Joi.string().allow('', null),
  bank_routing: Joi.string().allow('', null),
  bank_account_id: Joi.string().allow('', null),
  ower_name: Joi.string().allow('', null),
  ower_phone_1: Joi.string().allow('', null),
  ower_phone_2: Joi.string().allow('', null),
  ower_mail: Joi.string().allow('', null),
  user_name: Joi.string().allow('', null),
  password: Joi.string().allow('', null),
};

const validateRules = {
  createpartner: {
    body: partnerCreateOrUpdate,
  },
  updatePartner: {
    body: partnerCreateOrUpdate,
  },
};

module.exports = validateRules;
