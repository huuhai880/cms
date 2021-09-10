const Joi = require('joi');

const ruleCreateOrUpdate = {
  formula_id: Joi.number().allow('', null),
  formula_name: Joi.string().required(),
  attribute_id: Joi.number().required(),
  description: Joi.string().allow('', null),
  is_2_digit: Joi.number().valid(0, 1).allow('', null),
  is_1_digit: Joi.number().valid(0, 1).allow('', null),
  is_first_letter: Joi.number().valid(0, 1).allow('', null),
  is_last_letter: Joi.number().valid(0, 1).allow('', null),
  is_only_first_vowel: Joi.number().valid(0, 1).allow('', null),
  is_total_vowels: Joi.number().valid(0, 1).allow('', null),
  is_total_values: Joi.number().valid(0, 1).allow('', null),
  is_count_of_num: Joi.number().valid(0, 1).allow('', null),
  is_total_consonant: Joi.number().valid(0, 1).allow('', null),
  is_total_letters: Joi.number().valid(0, 1).allow('', null),
  is_num_show_3_time: Joi.number().valid(0, 1).allow('', null),
  is_total_first_letter: Joi.number().valid(0, 1).allow('', null),
  is_num_of_letters: Joi.number().valid(0, 1).allow('', null),
  is_num_show_0_time: Joi.number().valid(0, 1).allow('', null),
  is_not_shortened: Joi.number().valid(0, 1).allow('', null),
  param_name_id: Joi.number().allow('', null),
  is_expression: Joi.number().valid(0, 1).allow('', null),
  calculation_id: Joi.number().allow('', null),
  parent_formula_id: Joi.number().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
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
