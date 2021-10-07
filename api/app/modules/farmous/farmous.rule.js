const Joi = require('joi');

const ruleCreateOrUpdate = {
  farmous_name: Joi.string().required(),
  gender: Joi.number().required(),
  position: Joi.string().required(),
  birthday: Joi.string().required(),
  image_avatar: Joi.string().required(),

  // priority: Joi.number().required(),
};

const validateRules = {
  createOrUpdatefarmous: ruleCreateOrUpdate,
};

module.exports = validateRules;
