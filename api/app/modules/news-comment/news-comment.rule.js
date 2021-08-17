const Joi = require('joi');

const ruleCreate = {
  new_id: Joi.number().allow('', null),
  comment_content: Joi.string().required(),
};

const validateRules = {
  createNewsComment: {
    body: ruleCreate,
  },
};

module.exports = validateRules;
