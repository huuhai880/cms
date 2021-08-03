const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  comment_rating_id: '{{#? COMMENTRATINGID}}',
  comment_type_id: '{{#? COMMENTTYPEID}}',
  rating: '{{#? RATING}}',
  username: '{{#? USERNAME}}',
  key_type: '{{#? KEYTYPE}}',
  content: '{{#? CONTENT}}',
  created_date: '{{#? CREATEDDATE}}',
  created_user: '{{#? CREATEDUSER}}',
  images_url: [
    {
      '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  author: '{{#? AUTHOR}}',
  news: '{{#? NEWS}}',
  product: '{{#? PRODUCT}}',
};

let transform = new Transform(template);

const list = (values) => {
  return transform.transform(values, [
    'comment_rating_id',
    'comment_type_id',
    'rating',
    'username',
    'key_type',
    'content',
    'created_date',
    'created_user',
    'author',
    'news',
    'product',
  ]);
};

const listImage = (values) => {
  return transform.transform(values, ['images_url']);
};

module.exports = {
  list,
  listImage,
};
