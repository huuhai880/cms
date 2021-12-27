const Joi = require('joi');

const ruleCreateOrder = Joi.object().keys({
    email: Joi.string().required(),
    member_id: Joi.number().required(),
    status: Joi.number().required(),
    order_details: Joi.array().items(
        Joi.object({
            temp_id: Joi.string().required(),
        })
    ).required()
});

const validateRules = {
    createOrder: {
        body: ruleCreateOrder,
    },
};

module.exports = validateRules;