const Joi = require('joi');

const ruleCreateOrUpdate = {
      param_name_id: Joi.number().allow('', null),
      is_name_type: Joi.string().required(),
      is_full_name: Joi.number().valid(0, 1).required(),
      is_last_name: Joi.number().valid(0, 1).required(),
      is_first_middle_name: Joi.number().valid(0, 1).required(),
      is_active: Joi.number().valid(0, 1).required(),
    };
    
    const validateRules = {
      createParamName: {
        body: ruleCreateOrUpdate,
      },
      updateParamName: {
        body: ruleCreateOrUpdate,
      },
    };
    
    module.exports = validateRules;
    