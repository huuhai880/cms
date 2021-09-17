const Joi = require('joi');

const checkCustomerType = (value, helpers) => {
    let check = (value || []).filter(p => !p.is_apply_promotion && !p.is_apply_price)
    if (check.length > 0) {
        return helpers.error("any.invalid");
    }
    return value;
};

const contentsLength = (value, helpers) => {
    const len = value.map((v) => v.length).reduce((acc, curr) => acc + curr, 0);

    if (len > 200) {
        return helpers.message(
            "the contents of the array must not exceed 200 characters"
        );
    }

    return value;
};

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
            // .custom(contentsLength),
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
            // .custom(contentsLength)
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