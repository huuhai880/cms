const Joi = require('joi');

const ruleCreateOrUpdate = {
  picture_alias: Joi.string().allow(null,''),
  picture_url: Joi.string().allow(null,''),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createBanner: {
    body: ruleCreateOrUpdate,
  },
  updateBanner: {
    body: ruleCreateOrUpdate,
  },
  changeStatusBanner: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
