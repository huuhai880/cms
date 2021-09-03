const Transform = require('../../common/helpers/transform.helper');
const template = {
  attributes_group_id: '{{#? ATTRIBUTESGROUPID}}',
  group_name: '{{#? GROUPNAME}}',
  description: '{{#? DESCRIPTION}}',
  is_active: '{{ ISACTIVE? 1: 0}}',
};

let transform = new Transform(template);

const list = (AttibutesGroup = []) => {
  return transform.transform(AttibutesGroup, [
    'attributes_group_id',
    'group_name',
    'description',
    'is_active',
  ]);
};

const detail = (AttibutesGroup = []) => {
  return transform.transform(AttibutesGroup, [
    'attributes_group_id',
    'group_name',
    'description',
    'is_active',
  ]);
};

module.exports = {
  list,
  detail,
};
