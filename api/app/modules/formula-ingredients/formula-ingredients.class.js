const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  ingredient_id: '{{#? INGREDIENTID}}',
  ingredient_name: '{{#? INGREDIENTNAME}}',
  is_apply_dob: '{{ISAPPLYDOB ? 1 : 0}}',
  is_apply_name: '{{ISAPPLYNAME ? 1 : 0}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_master: '{{ISMASTER ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
};
let transform = new Transform(template);

const listIngredients = (users = []) => {
  return transform.transform(users, [
    'ingredient_id',
    'ingredient_name',
    'is_apply_dob',
    'is_apply_name',
    'is_active',
    'created_date',
  ]);
};

module.exports = { listIngredients };
