const Transform = require('../../common/helpers/transform.helper');
const template = {
  member_id: '{{#? MEMBERID}}',
  full_name: '{{#? FULLNAME}}',
  product_name: '{{#? PRODUCTNAME}}',
  search_count: '{{#? SEARCHCOUNT}}',
  search_date: '{{#? SEARCHDATE}}',
  is_active: '{{ ISACTIVE? 1: 0}}',
  product_id: '{{#? PRODUCTID}}',
};

let transform = new Transform(template);

const list = (SearchHistory = []) => {
  return transform.transform(SearchHistory, [
    'member_id',
    'full_name',
    'product_name',
    'attribute_name',
    'search_count',
    'search_date',
    'is_active',
  ]);
};

const detail = (SearchHistoryDetail = []) => {
  return transform.transform(SearchHistoryDetail, [
    'member_id',
    'full_name',
    'search_date',
    'is_active',
  ]);
};

const detailProduct = (SearchHistoryDetailProduct = []) => {
  return transform.transform(SearchHistoryDetailProduct, [
    'product_id',
    'product_name',
    'search_count',
    'search_date',
  ]);
};

module.exports = {
  list,
  detail,
  detailProduct,
};
