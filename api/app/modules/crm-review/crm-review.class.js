const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  review_id: '{{#? REVIEWID}}',
  member_id: '{{#? MEMBERID}}',
  account_name: '{{#? ACCOUNTNAME}}',
  check_member: '{{#? CHECKMEMBER}}',
  author_id: '{{#? AUTHORID}}',
  author_name: '{{#? AUTHORNAME}}',
  check_author: '{{#? CHECKAUTHOR}}',
  order_index: '{{#? ORDERINDEX}}',
  is_active: '{{#? ISACTIVE}}',
  review_content: '{{#? REVIEWCONTENT}}',
  review_date: '{{#? REVIEWDATE}}',
};

let transform = new Transform(template);

const list = (Partner = []) => {
  return transform.transform(Partner, [
    'review_id',
    'member_id',
    'account_name',
    'author_id',
    'author_name',
    'review_date',
    'is_active',
  ]);
};

const detail = (Partner = []) => {
  return transform.transform(Partner, [
    'review_id',
    'member_id',
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
