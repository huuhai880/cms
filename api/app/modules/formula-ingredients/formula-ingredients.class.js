const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  ingredient_id: '{{#? INGREDIENTID}}',
  ingredient_name: '{{#? INGREDIENTNAME}}',
  is_apply_dob: '{{ISAPPLYDOB ? 1 : 0}}',
  param_dob_id: '{{#? PARAMDOBID}}',
  dob_type: '{{#? DOBTYPE}}',
  is_apply_name: '{{ISAPPLYNAME ? 1 : 0}}',
  param_name_id: '{{#? PARAMNAMEID}}',
  name_type: '{{#? NAMETYPE}}',
  calculation_id: '{{#? CALCULATIONID}}',
  ingredient__child_1_id: '{{#? ORTHERINGREDIENTID1}}',
  ingredient__child_2_id: '{{#? ORTHERINGREDIENTID2}}',
  calculation: '{{#? CALCULATION}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  // is_vowel: '{{ISVOWEL ? 1 : 0}}',
  // desc: '{{#? DESCRIPTION}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  is_vowel: '{{ISVOWELS ? 1 : 0}}',
  is_onlyfirst_vowel: '{{ISONLYFIRSTVOWEL ? 1 : 0}}',
  is_consonant: '{{ISCONSONANT ? 1 : 0}}',
  is_first_letter: '{{ISFIRSTLETTER ? 1 : 0}}',
  is_last_letter: '{{ISLASTLETTER ? 1 : 0}}',
  is_show_3_time: '{{ISNUMSHOW3TIME ? 1 : 0}}',
  is_show_0_time: '{{ISNUMSHOW0TIME ? 1 : 0}}',
  is_total_shortened: '{{ISTOTALSHORTENED ? 1 : 0}}',
  is_no_total_shortened: '{{ISTOTALNOSHORTENED ? 1 : 0}}',
  is_total_2_digit: '{{ISTOTAL2DIGIT ? 1 : 0}}',
  is_crrent_age: '{{ISCURRENTAGE ? 1 : 0}}',
  is_crrent_year: '{{ISCURRENTYEAR ? 1 : 0}}',
  is_value: '{{ISVALUEINGREDIENTS ? 1 : 0}}',
  is_get_last_2_digit: '{{GETLAST2DIGITS ? 1 : 0}}',
  is_count_tofnum: '{{ISCOUNTOFNUM ? 1 : 0}}',
  is_numletter_2digit: '{{ISNUMLETTERS2DIGIT ? 1 : 0}}',
  is_numletter_1digit: '{{ISNUMLETTERS1DIGIT ? 1 : 0}}',
  is_total_value_2digit: '{{ISTOTALVALUES2DIGIT ? 1 : 0}}',
  is_total_value_1digit: '{{ISTOTALVALUES1DIGIT ? 1 : 0}}',
  is_total_letter_first_2digit: '{{ISTOTALFIRSTLETTER2DIGIT	 ? 1 : 0}}',
  is_total_letter_first_1digit: '{{ISTOTALFIRSTLETTER1DIGIT	 ? 1 : 0}}',
  is_total_letter_2digit: '{{ISTOTALLETTERS2DIGIT	 ? 1 : 0}}',
  is_total_letter_1digit: '{{ISTOTALLETTERS1DIGIT	 ? 1 : 0}}',
  ingredient_value: '{{#? VALUEINGREDIENTS}}',
};
let transform = new Transform(template);
const list = (users = []) => {
  return transform.transform(users, [
    'ingredient_id',
    'ingredient_name',
    'is_apply_dob',
    'is_apply_name',
    'is_active',
    'created_date',
  ]);
};
const listParamDob = (users = []) => {
  return transform.transform(users, ['param_dob_id', 'dob_type']);
};
const listParamName = (users = []) => {
  return transform.transform(users, ['param_name_id', 'name_type']);
};
const listCalculation = (users = []) => {
  return transform.transform(users, ['calculation', 'calculation_id']);
};
const listIngredient = (users = []) => {
  return transform.transform(users, ['ingredient_id', 'ingredient_name']);
};
const detail = (users = []) => {
  return transform.transform(users, [
    'ingredient_id',
    'ingredient_name',
    'is_apply_dob',
    'is_apply_name',
    'is_active',
    'calculation_id',
    'param_dob_id',
    'param_name_id',
    'is_vowel',
    'is_onlyfirst_vowel',
    'is_consonant',
    'is_first_letter',
    'is_last_letter',
    'is_show_3_time',
    'is_show_0_time',
    'is_total_shortened',
    'is_no_total_shortened',
    'is_total_2_digit',
    'is_crrent_age',
    'is_crrent_year',
    'is_value',
    'is_get_last_2_digit',
    'ingredient__child_1_id',
    'ingredient__child_2_id',
    'is_count_tofnum',
    'is_count_tofnum',
    'is_numletter_2digit',
    'is_numletter_1digit',
    'is_total_value_2digit',
    'is_total_value_1digit',
    'is_total_letter_first_2digit',
    'is_total_letter_first_1digit',
    'is_total_letter_2digit',
    'is_total_letter_1digit',
    'ingredient_value',
  ]);
};
module.exports = {
  list,
  listCalculation,
  listParamName,
  listParamDob,
  detail,
  listIngredient,
};
