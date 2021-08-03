const Joi = require('joi');

const ruleCreateOrUpdate = {
  publishing_company_name: Joi.string().required(),
};

const validateRules = {
  createPublishingCompany: ruleCreateOrUpdate,
  updatePublishingCompany: ruleCreateOrUpdate,
};

module.exports = validateRules;

