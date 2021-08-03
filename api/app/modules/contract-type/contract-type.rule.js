const Joi = require('joi');

const ruleCreateOrUpdate = {
  contract_type_name: Joi.string().required(),
  cost_contract: Joi.number().allow(null,''),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  create: {
    body: ruleCreateOrUpdate,
  },
  update: {
    body: ruleCreateOrUpdate,
  },
  changeStatus: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
