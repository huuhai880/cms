const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  formula_id: '{{#? FORMULAID}}',
  formula_name: '{{#? FORMULANAME}}',
  attribute_id: '{{#? ATTRIBUTEID}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  description: '{{#? DESCRIPTION}}',
  param_id: '{{#? PARAMID}}',
  dob_type: '{{#? DOBTYPE}}',
  is_total_shortened: '{{ ISTOTALSHORTENED? 1: 0}}',
  last_2_digits: '{{ LAST2DIGITS? 1: 0}}',
  parent_formula_id: '{{#?  PARENTFORMULAID}}',
  parent_formula_name: '{{#?  PARENTFORMULANAME}}',
  parent_calculation_id: '{{#?  PARENTCALCULATIONID}}',
  parent_calculation_name: '{{#?  PARENTCALCULATIONNAME}}',
  calculation_id: '{{#?  CALCULATIONID}}',
  calculation: '{{#?  CALCULATION}}',
  index_1: '{{#? INDEX1}}',
  index_2: '{{#? INDEX2}}',
  key_milestones: '{{ KEYMILESTONES? 1: 0}}',
  second_milestones: '{{ SECONDMILESTONES? 1: 0}}',
  challenging_milestones: '{{ CHALLENGINGMILESTONES? 1: 0}}',
  age_milestones: '{{#?  AGEMILESTONES}}',
  year_milestones: '{{#?  YEARMILESTONES}}',
  values: '{{#?  VALUES}}',
  is_active: '{{ ISACTIVE? 1: 0}}',
};

let transform = new Transform(template);

const list = (FormulaByDob = []) => {
  return transform.transform(FormulaByDob, [
    'formula_id',
    'formula_name',
    'attribute_id',
    'attribute_name',
    'description',
    'is_active',
  ]);
};

const detail = (FormulaByDob = []) => {
  return transform.transform(FormulaByDob, [
    'formula_id',
    'formula_name',
    'attribute_id',
    'attribute_name',
    'description',
    'param_id',
    'dob_type',
    'is_total_shortened',
    'last_2_digits',
    'parent_formula_id',
    'parent_formula_name',
    'parent_calculation_id',
    'parent_calculation_name',
    'calculation_id',
    'calculation',
    'index_1',
    'index_2',
    'key_milestones',
    'second_milestones',
    'challenging_milestones',
    'age_milestones',
    'year_milestones',
    'values',
    'is_active',
  ]);
};

module.exports = {
  list,
  detail,
};
