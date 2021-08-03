const Joi = require('joi');

const ruleCreateOrUpdate = {
  question: Joi.string().required(),
  answer: Joi.string().required(),
  faq_type: Joi.string().required(),
};

const validateRules = {
  createFaq: {
    body: ruleCreateOrUpdate,
  },
  updateFaq: {
    body: ruleCreateOrUpdate,
  }
};

module.exports = validateRules;
