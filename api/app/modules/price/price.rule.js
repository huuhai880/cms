const Joi = require('joi');


const ruleCreate = Joi.object().keys({
    price: Joi.number().required(),
    discount_value: Joi.any().when("is_apply_promotion", {
        is: true,
        then: Joi.number()
            .required(),
        otherwise: Joi.optional(),
    }),
    products: Joi.any().when("is_apply_combo", {
        is: false,
        then: Joi.array()
            .required(),
        otherwise: Joi.optional(),
    }),
    combos: Joi.any().when("is_apply_combo", {
        is: true,
        then: Joi.array()
            .required(),
        otherwise: Joi.optional(),
    }),
    customer_types: Joi.any().when("is_apply_customer_type", {
        is: true,
        then: Joi.array()
            .required(),
        otherwise: Joi.optional(),
    }),
    from_date: Joi.any().when("is_apply_promotion", {
        is: true,
        then: Joi.string().allow('', null).required()
            .required(),
        otherwise: Joi.optional(),
    }),
});

const ruleUpdate = Joi.object().keys({
    price: Joi.number().required(),
    discount_value: Joi.any().when("is_apply_promotion", {
        is: true,
        then: Joi.number()
            .required(),
        otherwise: Joi.optional(),
    }),
    customer_types: Joi.any().when("is_apply_customer_type", {
        is: true,
        then: Joi.array()
            .required(),
        otherwise: Joi.optional(),
    }),
    from_date: Joi.any().when("is_apply_promotion", {
        is: true,
        then: Joi.string().allow('', null).required()
            .required(),
        otherwise: Joi.optional(),
    }),
});

const validateRules = {
    createPrice: {
        body: ruleCreate,
        options: {
            contextRequest: true,
        },
    },
    updatePrice: {
        body: ruleUpdate,
        options: {
            contextRequest: true,
        },
    },
};

module.exports = validateRules;