const Joi = require('joi');

const ruleCreateOrUpdate = {
  relationship: Joi.string().required(),
  //   number: Joi.number().required(),

  // priority: Joi.number().required(),
};

const validateRules = {
  createOrUpdateRelationship: ruleCreateOrUpdate,
};

module.exports = validateRules;
