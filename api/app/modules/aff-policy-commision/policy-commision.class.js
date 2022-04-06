const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    policy_commision_id: "{{#? POLICYCOMMISIONID}}",
    policy_commision_name: "{{#? POLICYCOMMISIONNAME}}",
    description: "{{#? DESCRIPTION}}",
    affiliate_type_id: '{{#? AFFILIATETYPEID}}',
    affiliate_type_name: '{{#? AFFILIATETYPENAME}}',
    is_default: '{{ISDEFAULT ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_limited_time: '{{ISLIMITEDTIME ? 1 : 0}}',
    start_date_register: '{{#? STARTDATEREGISTERVIEW}}',
    end_date_register: '{{#? ENDDATEREGISTERVIEW}}',
    is_affiliate_level_1: '{{ISAFFILIATELEVEL1 ? 1 : 0}}',
    is_affiliate_level_2: '{{ISAFFILIATELEVEL2 ? 1 : 0}}',

    condition_id: '{{#? CONDITIONID}}',
    condition_name: '{{#? CONDITIONNAME}}',
    condition_type: '{{#? CONDITIONTYPE}}', //1: VNĐ, 2: User
    is_personal_sales: '{{ISPERSONALSALES ? 1 : 0}}', //Ca nhan
    is_group_sales: '{{ISGROUPSALES ? 1 : 0}}', //Nhom
    is_user_introduction: '{{ISUSERINTRODUCTION ? 1 : 0}}', //La gioi thieu so nguoi
    po_commision_detail_id: '{{#? POCOMMISIONDETAILID}}',
    from_value: '{{#? FROMVALUE}}',
    to_value: '{{#? TOVALUE}}',
    comission_value: '{{#? COMISSIONVALUE}}',
    type: '{{#? TYPE}}'
}

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'policy_commision_id',
        'policy_commision_name',
        'description',
        'affiliate_type_id',
        'affiliate_type_name',
        'is_default',
        'is_active',
        'is_limited_time',
        'start_date_register',
        'end_date_register'
    ]);
};

const listAffiliateType = (list = []) => {
    return transform.transform(list, [
        'affiliate_type_id',
        'affiliate_type_name',
        'is_affiliate_level_1',
        'is_affiliate_level_2'
    ]);
};


const listCondition = (list = []) => {
    return transform.transform(list, [
        'condition_id',
        'condition_name',
        'condition_type',
        'is_personal_sales',
        'is_group_sales',
        'is_user_introduction'
    ]);
};

const detail = (data = []) => {
    return data && Object.keys(data).length > 0 ? transform.transform(data, [
        'policy_commision_id',
        'policy_commision_name',
        'description',
        'affiliate_type_id',
        'is_default',
        'is_active',
        'is_limited_time',
        'start_date_register',
        'end_date_register'
    ]) : null;
};

const listPolicyDetail = (list = []) => {
    return transform.transform(list, [
        'po_commision_detail_id',
        'policy_commision_id',
        'condition_id',
        'condition_name',
        'condition_type',
        'from_value',
        'to_value',
        'comission_value',
        'type'
    ]);
};


module.exports = {
    list,
    listAffiliateType,
    listCondition,
    detail,
    listPolicyDetail
}

