const Joi = require('joi');

const ruleCreateOrUpdate = {
  formula_name: Joi.string().required(),
  attribute_gruop_id: Joi.number().required(),
  decs: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
  is_default: Joi.number().valid(0, 1).required(),
  order_index: Joi.string().required(),
  type1: Joi.number().valid(0, 1).required(),
  type2: Joi.number().valid(0, 1).required(),
  orderid_1: Joi.number().required(),
  orderid_2: Joi.number().required(),
  calculation_id: Joi.number().required(),
};

const validateRules = {
  createOrUpdateFormula: ruleCreateOrUpdate,
};

module.exports = validateRules;
