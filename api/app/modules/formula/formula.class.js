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
  is_total_2digit: "{{ISTOTAL2DIGIT ? 1 : 0}}"

};
let transform = new Transform(template);
const list = (users = []) => {
  return transform.transform(users, [
    'formula_id',
    'formula_name',
    'is_active',
    'created_date',
    'order_index',
    'gruop_name',
  ]);
};
const detail = (FormulaByDob = []) => {
  return transform.transform(FormulaByDob, [
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
    "is_total_2digit"
  ]);
};
const listCalculation = (users = []) => {
  return transform.transform(users, ['calculation', 'calculation_id']);
};
const listAttributeGruop = (users = []) => {
  return transform.transform(users, ['attribute_gruop_id', 'gruop_name']);
};
const listIngredient = (users = []) => {
  return transform.transform(users, ['ingredient_id', 'ingredient_name']);
};
const listFormulaParent = (users = []) => {
  return transform.transform(users, ['formula_id', 'formula_name']);
};
module.exports = {
  list,
  listCalculation,
  listIngredient,
  listFormulaParent,
  listAttributeGruop,
  detail,
};
