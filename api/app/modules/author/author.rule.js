const Joi = require('joi');

const ruleCreateOrUpdate = {
  nickname: Joi.string().required(),
  // password: Joi.string().required(),
  avatar_image: Joi.string().allow('', null),
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
  birthday: Joi.string().required(),
  gender: Joi.number().required(),
  phone_number: Joi.string().required(),
  email: Joi.string().allow('', null),
  identity_number: Joi.string()
    .regex(/^[0-9]{9,12}/)
    .allow('', null)
    .label("Số CMND/ Thẻ căn cước")
    .error((errors) => {
      return errors.map(error => {
        switch (error.type) {
          case "string.regex.base":
            return { message: "Số CMND/ Thẻ căn cước từ 9 đến 12 số" };
        }}
      )
    }),
  identity_date: Joi.string().allow('', null),
  identity_place: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  province_id: Joi.number().allow('', null),
  district_id: Joi.number().allow('', null),
  country_id: Joi.number().allow('', null),
  ward_id: Joi.number().allow('', null),
  is_review_news: Joi.number().valid(0, 1).required(),
  is_active: Joi.number().valid(0, 1).required(),
  is_change_password: Joi.number().valid(0, 1).allow('', null),
};

const validateRules = {
  createAuthor: {
    body: ruleCreateOrUpdate,
  },
  updateAuthor: {
    body: ruleCreateOrUpdate,
  },
  changeStatusAuthor: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
