const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    member_id: "{{#? MEMBERID}}",
    customer_code: "{{#? CUSTOMERCODE}}",
    full_name: "{{#? FULLNAME}}",
    policy_commision_name: "{{#? POLICYCOMMISIONNAME}}",
    total_order: "{{TOTALORDER ? TOTALORDER : 0}}",
    total_commision: "{{TOTALCOMMISION ? TOTALCOMMISION : 0}}",
    registration_source: "{{#? REGISTRATIONSOURCE}}",
    status_affiliate: "{{#? STATUSAFFILIATE}}",
    registration_date: "{{#? REGISTRATIONDATEVIEW}}",
    affiliate_type_id: "{{#? AFFILIATETYPEID}}",
    affiliate_type_name: "{{#? AFFILIATETYPENAME}}",
    is_active: "{{ISACTIVE ? 1 : 0}}",

    email: '{{#? EMAIL}}',
    phone_number: '{{#? PHONENUMBER}}',
    province_id: '{{#? PROVINCEID}}',
    district_id: '{{#? DISTRICTID}}',
    ward_id: '{{#? WARDID}}',
    address: '{{#? ADDRESS}}',
    birth_day: '{{#? BIRTHDAY}}',
    id_card: '{{#? IDCARD}}',
    id_card_back_side: [
        {
            '{{#if IDCARDBACKSIDE}}': `${config.domain_cdn}{{IDCARDBACKSIDE}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    id_card_front_side: [
        {
            '{{#if IDCARDFRONTSIDE}}': `${config.domain_cdn}{{IDCARDFRONTSIDE}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    live_image: [
        {
            '{{#if LIVEIMAGE}}': `${config.domain_cdn}{{LIVEIMAGE}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],

    id_card_date: '{{#? IDCARDDATE}}',
    id_card_place: '{{#? IDCARDPLACE}}',

    label: '{{#? LABEL}}',
    value: '{{#? VALUE}}',
    is_default: '{{ISDEFAULT ? 1 : 0}}',
    policy_commision_type_id: '{{#? POLICYCOMMISIONTYPEID}}',
    policy_commision_type_name: '{{#? POLICYCOMMISIONTYPENAME}}',
    is_agree: '{{ISAGREE ? 1 : 0}}',
    review_note: '{{#? REVIEWNOTE}}',
    aff_leader_id: '{{#? LEADERID}}',
    is_affiliate_level_1: '{{ISAFFILIATELEVEL1 ? 1 : 0}}',
    is_affiliate_level_2: '{{ISAFFILIATELEVEL2 ? 1 : 0}}',
    date_of_approval : '{{#? DATEOFAPPROVALVIEW}}',
    order_date: '{{#? ORDERDATE}}',
    order_no: '{{#? ORDERNO}}',
    total_amount: '{{#? TOTALAMOUNT}}',
    total_order: '{{#? TOTALORDER}}',
    total_commision: '{{#? TOTALCOMMISION}}',
    order_id: '{{#? ORDERID}}',
    status: '{{#? STATUS}}',
    created_date: '{{#? CREATEDDATEVIEW}}',

    affiliate_request_id: '{{#? AFFILIATEREQUESTID}}',
    request_no: '{{#? REQUESTNO}}',
    request_status: '{{#? REQUESTSTATUS}}',
    approved_date: '{{#? APPROVEDDATEVIEW}}',
    review_user: '{{#? REVIEWUSER}}',
    review_user_full_name: '{{#? REVIEWUSERFULLNAME}}',
    policy_commision_id : '{{#? POLICYCOMMISIONID}}',
    policy_commision_name : '{{#? POLICYCOMMISIONNAME}}',
    request_status_name: '{{#? REQUESTSTATUSNAME}}',
    affiliate_id:'{{#? AFFILIATEID}}',
    total_revenue: '{{#? TOTALREVENUE}}'
}

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'member_id',
        'customer_code',
        'full_name',
        'policy_commision_name',
        'total_order',
        'total_commision',
        'registration_source',
        'status_affiliate',
        'registration_date',
        'affiliate_type_id',
        'affiliate_type_name',
        'is_active',
        'is_affiliate_level_1',
        'is_affiliate_level_2'
    ]);
};

const listMember = (list = []) => {
    return transform.transform(list, [
        'member_id',
        'customer_code',
        'value',
        'label',
        'full_name',
        'email',
        'phone_number',
        'birth_day',
        'province_id',
        'district_id',
        'ward_id',
        'address',
        'id_card',
        'id_card_back_side',
        'id_card_front_side',
        'live_image',
        'id_card_date',
        'id_card_place'
    ]);
};

const options = (list = []) => {
    return transform.transform(list, [
        'label',
        'value'
    ]);
};

const listPolicy = (list = []) => {
    return transform.transform(list, [
        'label',
        'value',
        'policy_commision_type_id',
        'policy_commision_type_name'
    ]);
};

const affiliateDetail = (aff = []) => {
    return aff && Object.keys(aff).length > 0 ? transform.transform(aff, [
        'affiliate_id',
        'member_id',
        'customer_code',
        'value',
        'label',
        'full_name',
        'email',
        'phone_number',
        'birth_day',
        'province_id',
        'district_id',
        'ward_id',
        'address',
        'id_card',
        'id_card_back_side',
        'id_card_front_side',
        'live_image',
        'id_card_date',
        'id_card_place',
        'is_active',
        'is_agree',
        'affiliate_type_id',
        'is_active',
        'affiliate_type_name',
        'is_affiliate_level_1',
        'is_affiliate_level_2',
        'registration_date',
        'approved_date'
    ]) : null;
};

const infoAff = (aff = []) => {
    return aff && Object.keys(aff).length > 0 ? transform.transform(aff, [
        'member_id',
        'customer_code',
        'full_name',
        'email',
        'phone_number',
        'affiliate_type_id',
        'affiliate_type_name',
        'registration_date',
        'date_of_approval',
        'is_active'
    ]) : null;
};

const listOrderAff = (list = []) => {
    return transform.transform(list, [
        'order_id',
        'order_date',
        'order_no',
        'total_amount',
        'total_commision',
        'status',
        'full_name'
    ]);
};

const listCustomerAff = (list = []) => {
    return transform.transform(list, [
        'member_id',
        'full_name',
        'created_date',
        'total_amount',
        'total_commision'
    ]);
};

const listMemberAff = (list = []) => {
    return transform.transform(list, [
        'member_id',
        'full_name',
        'created_date',
        'total_amount',
        'total_commision'
    ]);
};

const listAffRequest = (list = []) => {
    return transform.transform(list, [
        'affiliate_request_id',
        'request_no',
        'member_id',
        'request_status',
        'registration_date',
        'approved_date',
        'full_name',
        'request_status',
        'review_user_full_name'
    ]);
};

const detailAffRequest = (data = []) => {
    return data && Object.keys(data).length > 0 ? transform.transform(data, [
        'member_id',
        'affiliate_request_id',
        'request_no',
        'request_status',
        'is_agree',
        'affiliate_type_id',
        'affiliate_type_name',
        'registration_date',
        'customer_code',
        'full_name',
        'phone_number',
        'review_note',
        'review_user',
        'review_user_full_name',
        'approved_date',
        'id_card',
        'id_card_back_side',
        'id_card_front_side',
        'live_image',
        'id_card_date',
        'id_card_place',
        'birth_day',
        'request_status_name',
        'email',
        'province_id',
        'district_id',
        'ward_id',
        'address',
       
    ]) : null;
};

const listAffiliateType = (list = []) => {
    return transform.transform(list, [
        'affiliate_type_id',
        'affiliate_type_name',
        'is_affiliate_level_1',
        'is_affiliate_level_2'
    ]);
};

const listPolicyCommision = (list = []) => {
    return transform.transform(list, [
        'affiliate_type_id',
        'policy_commision_id',
        'policy_commision_name',
        'is_default',
        'value',
        'label'
    ]);
};

const listAffiliate = (list = []) => {
    return transform.transform(list, [
        'affiliate_id',
        'affiliate_type_id',
        'registration_source',
        'registration_date',
        'member_id',
        'affiliate_type_name',
        'total_order',
        'total_commision',
        'customer_code',
        'full_name',
        'is_affiliate_level_1',
        'is_affiliate_level_2',
        'is_active'
    ]);
};

const reportAffiliate = (data = []) => {
    return data && Object.keys(data).length > 0 ? transform.transform(data, [
        'total_revenue',
        'total_order',
        'total_commision'
    ]) : null;
};

module.exports = {
    list,
    listMember,
    options,
    listPolicy,
    affiliateDetail,
    infoAff,
    listOrderAff,
    listCustomerAff,
    listMemberAff,
    listAffRequest,
    detailAffRequest,
    listAffiliateType,
    listPolicyCommision,
    listAffiliate,
    reportAffiliate
}