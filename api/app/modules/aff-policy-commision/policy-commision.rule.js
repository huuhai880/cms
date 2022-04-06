const Joi = require('joi');

const ruleConditionDetail = Joi.object().keys({
    from_value: Joi.number().required(''),
    to_value: Joi.number().required(''),
    comission_value: Joi.number().required(''),
});

const ruleCondition = Joi.object().keys({
    condition_id: Joi.number().required(''),
    data_child: Joi.array().required()
        .items(ruleConditionDetail),
});


const ruleCreateOrUpdate = Joi.object().keys({
    policy_commision_name: Joi.string().required(),
    affiliate_type_id: Joi.number().required(),
    policy_commision_detail: Joi.array().required()
        .items(ruleCondition),
    start_date_register: Joi.any().when("is_limited_time", {
        is: true,
        then: Joi.string().allow('', null).required()
            .required(),
        otherwise: Joi.optional(),
    }),
});


const validateRules = {
    createOrUpdate: {
        body: ruleCreateOrUpdate,
        options: {
            contextRequest: true,
        },
    }
};

module.exports = validateRules;