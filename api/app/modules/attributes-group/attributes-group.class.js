const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  attributes_group_id: '{{#? ATTRIBUTESGROUPID}}',
  group_name: '{{#? GROUPNAME}}',
  description: '{{#? DESCRIPTION}}',
  instruction: '{{#? INTRODUCTION}}',

  is_active: '{{ ISACTIVE? 1: 0}}',
  is_powerditagram: '{{ ISPOWERDIAGRAM? 1: 0}}',
  is_emptyditagram: '{{ ISEMPTYDIAGRAM? 1: 0}}',
  symbol: '{{#? SYMBOL}}',
  icon_image: [
    {
      '{{#if ICONIMAGE}}': `${config.domain_cdn}{{ICONIMAGE}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
};

let transform = new Transform(template);

const list = (AttibutesGroup = []) => {
  return transform.transform(AttibutesGroup, [
    'attributes_group_id',
    'group_name',
    'description',
    'is_active',
    'is_powerditagram',
    'is_emptyditagram'
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
    'symbol',
    'icon_image'
  ]);
};

module.exports = {
  list,
  detail,
};
