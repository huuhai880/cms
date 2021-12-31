const Joi = require('joi');

const ruleCreateOrUpdate = {
    param_other_id: Joi.number().allow('', null),
    name_type: Joi.string().required(),
    // is_house_number: Joi.number().valid(0, 1).required(),
    // is_phone_number: Joi.number().valid(0, 1).required(),
    // is_license_plate: Joi.number().valid(0, 1).required(),
    // is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createOrUpdParamOther: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;