const Joi = require('joi');

const ruleCreateOrUpdate = {
  param_type_id: Joi.string().required(),
  param_type: Joi.string().required(),
  is_active: Joi.number().required(),
  is_day: Joi.number().required(),
  is_month: Joi.number().required(),
  is_year: Joi.number().required(),
};

const validateRules = {
  createOrUpdateParamType: ruleCreateOrUpdate,
};

module.exports = validateRules;
