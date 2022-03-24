const Joi = require('joi');

const ruleAccept = Joi.object().keys({
    wd_request_id: Joi.number().required(),
});

const ruleReject= Joi.object().keys({
    wd_request_id: Joi.number().required(),
    note:  Joi.string().required()
});

const validateRules = {
    accept: {
        body: ruleAccept
    },
    reject: {
        body: ruleReject
    }
};

module.exports = validateRules;