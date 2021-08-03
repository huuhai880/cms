const Joi = require('joi');

const ruleCreate = {
  product_category_id: Joi.number().required(),
  images: Joi.array().items(
    Joi.object({
      picture_url: Joi.required(),
    })
  ),
};

const ruleUpdate = {
  images: Joi.array().items(
    Joi.object({
      category_id: Joi.required(),
    })
  ),
};

const validateRules = {
  create: {
    body: ruleCreate,
  },
  update: {
    body: ruleUpdate,
  },
};

module.exports = validateRules;
