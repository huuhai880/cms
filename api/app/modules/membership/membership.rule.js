const Joi = require('joi');

const rulechangeStatus = {
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  changeStatusMembership:rulechangeStatus,
};

module.exports = validateRules;

