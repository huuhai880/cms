const Joi = require('joi');

const ruleCreateOrUpdate = {
  formula_name: Joi.string().required(),
  attribute_id: Joi.number().allow('', null),
  attribute_name: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  param_id: Joi.number().required(),
  is_total_shortened: Joi.number().valid(0, 1).allow('', null),
  last_2_digits: Joi.number().valid(0, 1).allow('', null),
  parent_formula_id: Joi.number().allow('', null),
  parent_calculation_id: Joi.number().allow('', null),
  calculation_id: Joi.number().required(),
  index_1: Joi.number().required(),
  index_2: Joi.number().required(),
  key_milestones: Joi.number().valid(0, 1).allow('', null),
  second_milestones: Joi.number().valid(0, 1).allow('', null),
  challenging_milestones: Joi.number().valid(0, 1).allow('', null),
  // age_milestones: Joi.string().required(),
  // year_milestones: Joi.string().required(),
  // values: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createFormulaByDob: {
    body: ruleCreateOrUpdate,
  },
  updateFormulaByDob: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
