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
    id_card_plate: '{{#? IDCARDPLACE}}',

    label: '{{#? LABEL}}',
    value: '{{#? VALUE}}',
    is_default: '{{ISDEFAULT ? 1 : 0}}',
    policy_commision_type_id: '{{#? POLICYCOMMISIONTYPEID}}',
    policy_commision_type_name: '{{#? POLICYCOMMISIONTYPENAME}}'
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
        'is_active'
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
        'id_card_plate'
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

module.exports = {
    list,
    listMember,
    options,
    listPolicy
}