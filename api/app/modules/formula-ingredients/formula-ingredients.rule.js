const Joi = require('joi');

const ruleCreateOrUpdate = {
  ingredient_name: Joi.string().required(),
};

const validateRules = {
  createOrUpdateIngredient: ruleCreateOrUpdate,
};

module.exports = validateRules;
