const Joi = require('joi');

const ruleCreateOrUpdate = {
  attribute_id: Joi.number().allow('', null),
  attribute_name: Joi.string().required(),
  attributes_group_id: Joi.number().required(),
  main_number_id: Joi.number().required(),
  description: Joi.string().allow('', null),
  list_attributes_image: Joi.array().allow('', null),
};

const validateRules = {
  createFormulaByName: {
    body: ruleCreateOrUpdate,
  },
  updateFormulaByName: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
