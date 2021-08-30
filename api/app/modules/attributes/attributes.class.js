const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  attribute_id: '{{#? ATTRIBUTEID}}',
  attribute_name: '{{#? ATTRIBUTENAME}}',
  description: '{{#? DESCRIPTION}}',
  main_number_id: '{{#? MAINNUMBERID}}',
  imges_id: '{{#? IMGESID}}',
  partner_id: '{{#? PARTNERID}}',
  is_active: '{{ ISACTIVE? 1: 0}}',
  is_active_image: '{{ ISACTIVEIMAGE? 1: 0}}',
  is_default: '{{ ISDEFAULT? 1: 0}}',
  url_images: [
    {
      '{{#if URLIMAGES}}': `${config.domain_cdn}{{URLIMAGES}}`,
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
    'attribute_name',
    'description',
    'main_number_id',
    'is_active',
  ]);
};

const detail = (Attibutes = []) => {
  return transform.transform(Attibutes, [
    'attribute_id',
    'attribute_name',
    'description',
    'main_number_id',
    'is_active',
  ]);
};

const detailAttributeImage = (AttibuteImage = []) => {
  return transform.transform(AttibuteImage, [
    'imges_id',
    'partner_id',
    'url_images',
    'is_active_image',
    'is_default',
  ]);
};

module.exports = {
  list,
  detail,
  detailAttributeImage,
};
