const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  news_id: '{{#? NEWSID}}',
  news_comment_id: '{{#? COMMENTID}}',
  news_comment_user_fullname: '{{#? FULLNAME}}',
  news_comment_user_img: [
    {
      '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  news_comment_content: '{{#? COMMENTCONTENT}}',
  is_review: '{{ #? ISREVIEW }}',
  is_review_user: '{{#? REVIEWUSER}}',
  is_staffcomment: '{{#? ISSTAFFCOMMENT }}',
  news_comment_admin_fullname: '{{#? COMMENTUSER}}',
  news_comment_create_date: '{{#? CREATEDDATE}}',
};
let transform = new Transform(template);
const listComment = (areas = []) => {
  return transform.transform(areas, [
    'news_id',
    'news_comment_id',
    'news_comment_user_img',
    'news_comment_user_fullname',
    'news_comment_content',
    'is_review',
    'is_staffcomment',
    'news_comment_admin_fullname',
    'news_comment_create_date',
    'is_review_user'
  ]);
};
module.exports = {
  listComment,
};
