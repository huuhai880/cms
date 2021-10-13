const Transform = require('../../common/helpers/transform.helper');
const template = {
  attributes_group_id: '{{#? ATTRIBUTESGROUPID}}',
  group_name: '{{#? GROUPNAME}}',
  description: '{{#? DESCRIPTION}}',
  instruction: '{{#? INTRODUCTION}}',

  is_active: '{{ ISACTIVE? 1: 0}}',
  is_powerditagram: '{{ ISPOWERDIAGRAM? 1: 0}}',
  is_emptyditagram: '{{ ISEMPTYDIAGRAM? 1: 0}}',
};

let transform = new Transform(template);

const list = (AttibutesGroup = []) => {
  return transform.transform(AttibutesGroup, [
    'attributes_group_id',
    'group_name',
    'description',
    'is_active',
    'is_powerditagram',
    'is_emptyditagram',
  ]);
};

const detail = (AttibutesGroup = []) => {
  return transform.transform(AttibutesGroup, [
    'attributes_group_id',
    'group_name',
    'description',
    'instruction',
    'is_active',
    'is_powerditagram',
    'is_emptyditagram',
  ]);
};

module.exports = {
  list,
  detail,
};
