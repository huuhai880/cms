const Joi = require('joi');

const ruleCreateOrUpdate = {
  calculation_id: Joi.number().allow('', null),
  calculation: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createCalculation: {
    body: ruleCreateOrUpdate,
  },
  updateCalculation: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
