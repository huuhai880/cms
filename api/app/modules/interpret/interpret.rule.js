const Joi = require('joi');

const ruleCreateOrUpdate = {
  // relationship_id: Joi.string().required(),
  mainnumber_id: Joi.string().required(),
  // compare_mainnumber_id: Joi.string().required(),
  attribute_id: Joi.string().required(),
  is_active: Joi.string().required(),
  is_master: Joi.string().required(),
  decs: Joi.string().required(),
  brief_decs: Joi.string().required(),
  // priority: Joi.number().required(),
};
const ruleCreateOrUpdateDetail = {
  interpret_id: Joi.string().required(),
  interpret_detail_name: Joi.string().required(),
  interpret_detail_short_content: Joi.string().required(),
  interpret_detail_full_content: Joi.string().required(),
};
const validateRules = {
  createOrUpdateIntergret: ruleCreateOrUpdate,
  createOrUpdateIntergretDetail: ruleCreateOrUpdateDetail,

};

module.exports = validateRules;
