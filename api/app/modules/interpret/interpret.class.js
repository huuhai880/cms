const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  interpret_id: '{{#? INTERPRETID}}',
  interpret_detail_parent_id: '{{#? INTERPRETID}}',
  interpret_detail_id: '{{#? INTERPRETDETAILID}}',
  interpret_detail_name: '{{#? INTERPRETDETAILNAME}}',
  interpret_detail_parent_id: '{{#? PARENTID}}',
  interpret_detail_parent_name: '{{#? INTERPRETDETAILNAME}}',
  interpret_detail_parentname: '{{#? PARENTNAME}}',
  interpret_detail_short_content: '{{#? SHORTCONTENT}}',
  interpret_detail_full_content: '{{#? FULLCONTENT}}',
  order_index: '{{#? ORDERINDEX}}',
  relationship_id: '{{#? RELATIONSHIPID}}',
  relationship: '{{#? RELATIONSHIP}}',
  mainnumber_id: '{{#? MAINNUMBERID}}',
  compare_mainnumber_id: '{{#? COMPARENUM}}',
  mainnumber: '{{#? MAINNUMBER}}',
  attribute_id: '{{#? ATTRIBUTEID}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  decs: '{{#? DESCRIPTION}}',
  brief_decs: '{{#? BRIEFDESCRIPTION}}',
  note: '{{#? NOTICE}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_master: '{{ISMASTER ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  parent_id: "{{#? PARENTID}}",
  parent_interpret_detail_name: '{{#? PARENTINTERPRETDETAILNAME}}',
  group_name: '{{#? GROUPNAME}}',
  compare_attribute_id: "{{#? COMPAREATTRIBUTEID}}"
};

let transform = new Transform(template);
const detailInterpretDetail = (users = []) => {
  return transform.transform(users, [
    'interpret_detail_parent_id',
    'interpret_id',
    'interpret_detail_id',
    'interpret_detail_name',
    'interpret_detail_parentname',
    'interpret_detail_short_content',
    'interpret_detail_full_content',
    'is_active',
    'order_index'
  ]);
};

const listInterpretDetail = (users = []) => {
  return transform.transform(users, [
    'interpret_detail_id',
    'interpret_detail_name',
    'interpret_detail_parentname',
    'interpret_detail_short_content',
    'is_active',
    'interpret_id',
    'parent_id',
    'order_index',
    'parent_interpret_detail_name'
  ]);
};

const listInterpret = (users = []) => {
  return transform.transform(users, [
    'interpret_id',
    'attribute_name',
    'brief_decs',
    'is_active',
    'order_index'
  ]);
};

const listInterpretParent = (users = []) => {
  return transform.transform(users, [
    'interpret_detail_parent_id',
    'interpret_detail_parent_name',
  ]);
};

const listRelationship = (users = []) => {
  return transform.transform(users, ['relationship_id', 'relationship']);
};

const listMainnumber = (users = []) => {
  return transform.transform(users, ['mainnumber_id', 'mainnumber']);
};

const listAttribute = (users = []) => {
  return transform.transform(users, ['attribute_id', 'attribute_name','mainnumber_id']);
};

const detailInterpret = (users = []) => {
  return transform.transform(users, [
    'mainnumber',
    'attribute_name',
    'interpret_id',
    'relationship_id',
    'compare_mainnumber_id',
    'mainnumber_id',
    'attribute_id',
    'decs',
    'brief_decs',
    'note',
    'is_master',
    'is_active',
    'order_index',
    'group_name',
    'compare_attribute_id'
  ]);
};

module.exports = {
  listRelationship,
  listMainnumber,
  listAttribute,
  detailInterpret,
  listInterpret,
  listInterpretDetail,
  listInterpretParent,
  detailInterpretDetail,
};
