const Joi = require('joi');

const ruleCreateOrUpdate = {
  letter: Joi.string().required(),
  number: Joi.number().required(),

  // priority: Joi.number().required(),
};

const validateRules = {
  createOrUpdateLetter: ruleCreateOrUpdate,
};

module.exports = validateRules;
