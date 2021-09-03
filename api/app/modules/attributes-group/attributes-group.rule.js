const Joi = require('joi');

const ruleCreateOrUpdate = {
  attributes_group_id: Joi.number().allow('', null),
  group_name: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createAttributesGroup: {
    body: ruleCreateOrUpdate,
  },
  updateAttributesGroup: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
