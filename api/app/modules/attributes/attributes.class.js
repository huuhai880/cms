const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  attribute_id: '{{#? ATTRIBUTEID}}',
  attributes_group_id: '{{#? ATTRIBUTESGROUPID}}',
  group_name: '{{#? GROUPNAME}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  description: '{{#? DESCRIPTION}}',
  main_number_id: '{{#? MAINNUMBERID}}',
  main_number: '{{#? MAINNUMBER}}',
  imges_id: '{{#? IMGESID}}',
  partner_id: '{{#? PARTNERID}}',
  partner_name: '{{#? PARTNERNAME}}',
  is_active: '{{ ISACTIVE? 1: 0}}',
  is_active_image: '{{ ISACTIVEIMAGE? 1: 0}}',
  is_default: '{{ ISDEFAULT? 1: 0}}',
  is_default_famous: '{{ ISDEFAULT? 1: 0}}',

  url_images: [
    {
      '{{#if URLIMAGES}}': `${config.domain_cdn}{{URLIMAGES}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  farmous_id: '{{#? FAMOUSID}}',
  farmous_name: '{{#? FAMOUSNAME}}',
  position: '{{#? POSITIONNAME}}',
  birthday: '{{#? BIRTHDAY}}',
  gender: '{{#? GENDER}}',
  order_index: '{{#? ORDERINDEX}}',
  image_avatar: [
    {
      '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
};

let transform = new Transform(template);

const list = (Attibutes = []) => {
  return transform.transform(Attibutes, [
    'attribute_id',
    'attributes_group_id',
    'group_name',
    'attribute_name',
    'description',
    'main_number_id',
    'main_number',
    'is_active',
  ]);
};

const detail = (Attibutes = []) => {
  return transform.transform(Attibutes, [
    'attribute_id',
    'attributes_group_id',
    'group_name',
    'attribute_name',
    'description',
    'main_number_id',
    'main_number',
    'is_active',
  ]);
};

const detailAttributeImage = (AttibuteImage = []) => {
  return transform.transform(AttibuteImage, [
    'imges_id',
    'partner_id',
    'partner_name',
    'url_images',
    'is_active_image',
    'is_default',
  ]);
};
const detailAttributeFamous = (AttributeFamous = []) => {
  return transform.transform(AttributeFamous, [
    'farmous_id',
    'farmous_name',
    'position',
    'birthday',
    'gender',
    'order_index',
    'is_default_famous',
    'image_avatar',
  ]);
};
module.exports = {
  list,
  detail,
  detailAttributeImage,
  detailAttributeFamous,
};
