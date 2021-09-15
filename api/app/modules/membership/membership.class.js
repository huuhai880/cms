const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'membership_id': '{{#? MEMBERSHIPID}}',
  'member_id': '{{#? MEMBERID}}',
  'full_name': '{{#? FULLNAME}}',
  'nick_name': '{{#? NICKNAME}}',
  'phone_number': '{{#? PHONENUMBER}}',
  'business_id': '{{#? BUSINESSID}}',
  'business_name': '{{#? BUSINESSNAME}}',
  'membership_group_id': '{{#? MEMBERSHIPGROUPID}}',
  'membership_group_name': '{{#? MEMBERSHIPGROUPNAME}}',
  'start_date': '{{#? STARTDATE}}',
  'end_date': '{{#? ENDDATE}}',
  'total_values': '{{#? TOTALVALUES}}',
  'number_request': '{{#? NUMBERREQUEST}}',
  'is_number_request': '{{ISNUMBERREQUEST ? 1 : 0}}',
  'product_id': '{{#? PRODUCTID}}',
  'combo_id': '{{#? COMBOID}}',
  'product_show_name': '{{#? PRODUCTSHOWNAME}}',
  'created_date': "{{#? CREATEDDATEVIEW}}"
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'membership_id',
        'member_id',
        'full_name',
        'nick_name',
        'phone_number',
        'business_id',
        'membership_group_id',
        'membership_group_name',
        'total_values',
        'number_request',
        'is_number_request',
        'product_id',
        'combo_id',
        'product_show_name',
        'created_date'
    ]);
};

module.exports = {
  list
};
