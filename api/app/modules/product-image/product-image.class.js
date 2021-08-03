const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  product_picture_id: '{{#? PRODUCTPICTUREID}}',
  picture_url: `${config.domain_cdn}{{PICTUREURL}}`,
  is_default: '{{#? ISDEFAULT}}',
};

let transform = new Transform(template);

const list = (areas = []) => {
  return transform.transform(areas, [
    'product_picture_id',
    'picture_url',
    'is_default',
  ]);
};

module.exports = {
  list,
};
