const Joi = require('joi');

const ruleCreateAff = {
    member_id: Joi.number().required(),
    affiliate_type_id: Joi.number().required(),
    phone_number: Joi.string().required(),
    address: Joi.string().required(),
    province_id: Joi.number().required(),
    district_id: Joi.number().required(),
    ward_id: Joi.number().required(),
    id_card: Joi.string().required(),
    id_card_date: Joi.string().required(),
    id_card_place: Joi.string().required(),
    id_card_back_side: Joi.string().required(),
    id_card_front_side: Joi.string().required(),
    live_image: Joi.string().required()
};

const validateRules = {
    createAff: {
        body: ruleCreateAff,
    },
};

module.exports = validateRules;
