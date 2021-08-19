const Joi = require('joi');

const ruleCreateOrUpdate = {
  member_id: Joi.number().allow('', null),
  author_id: Joi.number().allow('', null),
  order_index: Joi.number().required(),
  review_date: Joi.string().allow('', null),
  review_content: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createReview: {
    body: ruleCreateOrUpdate,
  },
  updateReview: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
