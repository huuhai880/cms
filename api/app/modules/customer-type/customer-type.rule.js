const Joi = require('joi');

const ruleCreateOrUpdate = {
  customer_type_name: Joi.string().required(),
  customer_type_group_id: Joi.number().allow('', null),
  description: Joi.string().allow('', null),
  order_index: Joi.number().required(),
  is_default: Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createCustomerType: {
    body: ruleCreateOrUpdate,
  },
  updateCustomerType: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
