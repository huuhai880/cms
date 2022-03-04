const Joi = require('joi');

const ruleCreateUpd = Joi.object().keys({
    page_name: Joi.string().required(),
    page_type: Joi.number().required()
});

const validateRules = {
    createUpdatePage: {
        body: ruleCreateUpd,
        options: {
            contextRequest: true,
        },
    }
};

module.exports = validateRules;