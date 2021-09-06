const Joi = require('joi');

const ruleCreateOrUpdate = Joi.object().keys({
    combo_name: Joi.string().required(),
    combo_products: Joi.array().items(
        Joi.object({
            number_search: Joi.number().required(),
        })
    ).required(),
});

const validateRules = {
    createCombo: {
        body: ruleCreateOrUpdate,
        options: {
            contextRequest: true,
        },
    },
    updateCombo: {
        body: ruleCreateOrUpdate,
        options: {
            contextRequest: true,
        },
    },
};

module.exports = validateRules;