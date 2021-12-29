const Joi = require('joi');

const rulePicture = Joi.object().keys({
  picture_url: Joi.string().allow(null, ''),
  picture_alias: Joi.string().allow(null, ''),
  is_default: Joi.number().valid(0, 1).allow(null),
});
const ruleAttribute = Joi.object().keys({
  product_attribute_id: Joi.number().required(),
  attribute_values: Joi.string().allow(null, ''),
});

const ruleCreateOrUpdate = Joi.object().keys({
  product_category_id: Joi.number().required(),
  product_name: Joi.string().required(),
  product_name_show_web: Joi.string().required(),
  product_content_detail: Joi.string().allow(null, ''),
  short_description: Joi.string().required(),
  product_images: Joi.array().required(),
  product_attributes: Joi.array().items(
    Joi.object({
      attributes_group_id: Joi.number().required(),
    //   interprets: Joi.array().required()
    })
  ).required(),
});

const rulechangeStatus = {
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createProduct: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  updateProduct: {
    body: ruleCreateOrUpdate,
    options: {
      contextRequest: true,
    },
  },
  changeStatusProduct: rulechangeStatus,
};

module.exports = validateRules;
