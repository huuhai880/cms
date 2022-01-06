const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  formula_id: '{{#? FORMULAID}}',
  formula_name: '{{#? FORMULANAME}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_default: '{{ISDEFAULT ? 1 : 0}}',
  type1: '{{ISFOMULAORTHERID1 ? 1 : 0}}',
  type2: '{{ISFOMULAORTHERID2 ? 1 : 0}}',
  orderid_1: '{{#? ORTHERID1}}',
  orderid_2: '{{#? ORTHERID2}}',
  desc: '{{#? DESCRIPTION}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  calculation_id: '{{#? CALCULATIONID}}',
  calculation: '{{#? CALCULATION}}',
  ingredient_id: '{{#? INGREDIENTID}}',
  ingredient_name: '{{#? INGREDIENTNAME}}',
  gruop_name: '{{#? GROUPNAME}}',
  attribute_gruop_id: '{{#? ATTRIBUTESGROUPID}}',

  order_index: '{{#? ORDERINDEX}}',
  is_total_no_shortened: "{{ISTOTALNOSHORTENED ? 1 : 0}}",
  is_total_shortened: "{{ISTOTALSHORTENED ? 1 : 0}}",
  is_total_2digit: "{{ISTOTAL2DIGIT ? 1 : 0}}",

  is_couple_formula: '{{ISCOUPLEFORMULA ? 1 : 0}}',
  is_condition_formula: '{{ISCONDITIONFORMULA ? 1 : 0}}',
  ref_condition_id: '{{#? REFCONDITIONID}}',
  ref_formula_id: '{{#? REFFORMULAID}}',
  interpret_formula_id: '{{#? INTERPRETFORMULAID}}',

  is_fomula_orther_id: '{{ISFOMULAORTHERID ? 1 : 0}}',
  orther_id: '{{#? ORTHERID}}',
  attributes_group_id: '{{#? ATTRIBUTESGROUPID}}',
  condition_formula_id: '{{#? CONDITIONFORMULAID}}',
  value: '{{#? VALUE}}'

};
let transform = new Transform(template);

const list = (list = []) => {
  return transform.transform(list, [
    'formula_id',
    'formula_name',
    'is_active',
    'created_date',
    'order_index',
    'gruop_name',
    'is_couple_formula',
    'is_condition_formula'
  ]);
};

const detail = (data = {}) => {
  return Object.keys(data).length > 0 ? transform.transform(data, [
    'formula_id',
    'formula_name',
    'attribute_gruop_id',
    'desc',
    'is_active',
    'is_default',
    'type1',
    'type2',
    'orderid_1',
    'orderid_2',
    'calculation_id',
    'order_index',
    "is_total_no_shortened",
    "is_total_shortened",
    "is_total_2digit",
    "is_couple_formula",
    "is_condition_formula",
    "ref_condition_id",
    "ref_formula_id",
    "interpret_formula_id"
  ]) : null;
};

const listCalculation = (list = []) => {
  return transform.transform(list, ['calculation', 'calculation_id']);
};

const listAttributeGruop = (list = []) => {
  return transform.transform(list, ['attribute_gruop_id', 'gruop_name']);
};

const listIngredient = (list = []) => {
  return transform.transform(list, ['ingredient_id', 'ingredient_name']);
};

const listFormulaParent = (list = []) => {
  return transform.transform(list, ['formula_id', 'formula_name']);
};


const listConditionFormula = (list = []) => {
  return transform.transform(list, ['condition_formula_id', 'formula_id', 'attributes_group_id', 'value', 'is_fomula_orther_id', 'orther_id']);
};

module.exports = {
  list,
  listCalculation,
  listIngredient,
  listFormulaParent,
  listAttributeGruop,
  detail,
  listConditionFormula
};
