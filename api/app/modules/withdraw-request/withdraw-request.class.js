const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    wd_request_id: "{{#? WDREQUESTID}}",
    wd_request_no: "{{#? WDREQUESTNO}}",
    member_id: "{{#? MEMBERID}}",
    wd_request_status: "{{#? WDREQUESTSTATUS}}",
    payment_image: [
        {
            '{{#if PAYMENTIMAGE}}': `${config.domain_cdn}{{PAYMENTIMAGE}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    wd_values: "{{#? WDVALUES}}",
    wd_date_request: "{{#? WDDATEREQUEST}}",
    note: "{{#? NOTE}}",
    wd_date_confirm: "{{#? WDDATECONFIRM}}",
    bank_account_id: "{{#? BANKACCOUNTID}}",
    reason_cancel: "{{#? REASONCANCEL}}",
    apply_note: "{{#? APPLYNOTE}}",
    confirm_user_full_name: "{{#? CONFIRMUSERFULLNAME}}",
    full_name: '{{#? FULLNAME}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    description: '{{#? DESCRIPTION}}',
    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',
    confirm_user: '{{#? CONFIRMUSER}}',

    bank_id: '{{#? BANKID}}',
    bank_account_id: '{{#? BANKACCOUNTID}}',
    branch: '{{#? BRANCH}}',
    holder: '{{#? HOLDER}}',
    swift_number: '{{#? SWIFTNUMBER}}',
    bank_name: '{{#? BANKNAME}}',
    bank_code: '{{#? BANKCODE}}',
    bank_account_number: '{{#? BANKACCOUNTNUMBER}}'
}

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'wd_request_id',
        'wd_request_no',
        'member_id',
        'wd_request_status',
        'wd_values',
        'wd_date_request',
        'note',
        'wd_date_confirm',
        'confirm_user_full_name',
        'full_name',
        'customer_code'
    ]);
};

const detail = (data = {}) => {
    return data && Object.keys(data).length > 0 ? transform.transform(data, [
        'wd_request_id',
        'wd_request_no',
        'wd_request_status',
        'wd_values',
        'wd_date_request',
        'wd_date_confirm',
        'confirm_user',
        'confirm_user_full_name',
        'member_id',
        'note',
        'description',
        'full_name',
        'phone_number',
        'email',
        'customer_code',
        'bank_id',
        'bank_account_id',
        'branch',
        'holder',
        'swift_number',
        'bank_name',
        'bank_code',
        'bank_account_number'
    ]) : null;
};


module.exports = {
    list,
    detail
}