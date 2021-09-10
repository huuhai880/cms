const Transform = require('../../common/helpers/transform.helper');
const template = {
  formula_id: '{{#? FORMULAID}}',
  formula_name: '{{#? FORMULANAME}}',
  attribute_id: '{{#? ATTRIBUTEID}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  description: '{{#? DESCRIPTION}}',
  is_not_shortened: '{{ ISNOTSHORTENED? 1: 0}}',
  is_2_digit: '{{ IS2DIGIT? 1: 0}}',
  is_1_digit: '{{ IS1DIGIT? 1: 0}}',
  is_first_letter: '{{ ISFIRSTLETTER? 1: 0}}',
  is_last_letter: '{{ ISLASTLETTER? 1: 0}}',
  is_only_first_vowel: '{{ ISONLYFIRSTVOWEL? 1: 0}}',
  is_total_vowels: '{{ ISTOTALVOWELS? 1: 0}}',
  is_total_values: '{{ ISTOTALVALUES? 1: 0}}',
  is_count_of_num: '{{ ISCOUNTOFNUM? 1: 0}}',
  is_total_consonant: '{{ ISTOTALCONSONANT? 1: 0}}',
  is_total_letters: '{{ ISTOTALLETTERS? 1: 0}}',
  is_num_show_3_time: '{{ ISNUMSHOW3TIME? 1: 0}}',
  is_total_first_letters: '{{ ISTOTALFIRSTLETTERS? 1: 0}}',
  is_num_of_letters: '{{ ISNUMOFLETTERS? 1: 0}}',
  is_num_show_0_time: '{{ ISNUMSHOW0TIME? 1: 0}}',
  param_name_id: '{{#? PARAMNAMEID}}',
  name_type: '{{#? NAMETYPE}}',
  is_expression: '{{ ISEXPRESSION? 1: 0}}',
  calculation_id: '{{#? CALCULATIONID}}',
  calculation: '{{#? CALCULATION}}',
  parent_formula_id: '{{#? PARENTFORMULAID}}',
  parent_formula_name: '{{#? PARENTFORMULANAME}}',
  is_active: '{{ ISACTIVE? 1: 0}}',
};

let transform = new Transform(template);

const list = (Attibutes = []) => {
  return transform.transform(Attibutes, [
    'formula_id',
    'formula_name',
    'attribute_id',
    'attribute_name',
    'description',
    'is_active',
  ]);
};

const detail = (Attibutes = []) => {
  return transform.transform(Attibutes, [
    'formula_id',
    'formula_name',
    'attribute_id',
    'attribute_name',
    'description',
    'is_not_shortened',
    'is_2_digit',
    'is_1_digit',
    'is_first_letter',
    'is_last_letter',
    'is_only_first_vowel',
    'is_total_vowels',
    'is_total_values',
    'is_count_of_num',
    'is_total_consonant',
    'is_total_letters',
    'is_num_show_3_time',
    'is_total_first_letters',
    'is_num_of_letters',
    'is_num_show_0_time',
    'param_name_id',
    'name_type',
    'is_expression',
    'calculation_id',
    'calculation',
    'parent_formula_id',
    'parent_formula_name',
    'is_active',
  ]);
};

module.exports = {
  list,
  detail,
};
