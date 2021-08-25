const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  review_id: '{{#? REVIEWID}}',
  member_id: '{{#? MEMBERID}}',
  review_name: '{{#? REVIEWNAME}}',
  check_member: '{{#? CHECKMEMBER}}',
  author_id: '{{#? AUTHORID}}',
  check_author: '{{#? CHECKAUTHOR}}',
  order_index: '{{#? ORDERINDEX}}',
  is_active: '{{#? ISACTIVE}}',
  review_content: '{{#? REVIEWCONTENT}}',
  review_avatar: '{{#? REVIEWAVATAR}}',
  review_date: '{{#? REVIEWDATE}}',
};

let transform = new Transform(template);

const list = (Partner = []) => {
  return transform.transform(Partner, [
    'review_id',
    'member_id',
    'review_name',
    'author_id',
    'review_date',
    'is_active',
    'review_content',
    'review_avatar'
  ]);
};

const detail = (Partner = []) => {
  return transform.transform(Partner, [
    'review_id',
    'member_id',
    'review_name',
    'author_id',
    'review_date',
    'review_content',
    'order_index',
    'is_active',
    'check_member',
    'check_author',
  ]);
};

module.exports = {
  list,
  detail,
};
