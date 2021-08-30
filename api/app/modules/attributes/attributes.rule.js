const Joi = require('joi');

const ruleCreateOrUpdate = {
  attribute_id: Joi.number().allow('', null),
  attribute_name: Joi.string().required(),
  main_number_id: Joi.number().required(),
  description: Joi.string().allow('', null),
  list_attributes_image: Joi.array().allow('', null),
};

const validateRules = {
  createAttributes: {
    body: ruleCreateOrUpdate,
  },
  updateAttributes: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
