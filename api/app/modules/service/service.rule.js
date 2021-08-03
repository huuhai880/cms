const Joi = require('joi');

const ruleCreateOrUpdate = {
  service_name: Joi.string().required(),
  image: Joi.string().required(),
  content: Joi.string().required(),
};

const validateRules = {
  createService: {
    body: ruleCreateOrUpdate,
  },
  updateService: {
    body: ruleCreateOrUpdate,
  }
};

module.exports = validateRules;
