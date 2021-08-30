const Joi = require('joi');

const ruleCreateOrUpdate = {
  main_number: Joi.string().required(),
  // priority: Joi.number().required(),
};

const validateRules = {
  createMainNumber: ruleCreateOrUpdate,
  updateMainNumber: ruleCreateOrUpdate,
};

module.exports = validateRules;
