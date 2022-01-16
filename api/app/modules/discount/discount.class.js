const Transform = require('../../common/helpers/transform.helper');

const template = {
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    discount_id: '{{#? DISCOUNTID}}',
    discount_code: '{{#? DISCOUNTCODE}}',
    is_percent_discount: '{{#? ISPERCENTDISCOUNT}}',
    is_money_discount: '{{#? ISMONEYDISCOUNT}}',
    discount_value: '{{#? DISCOUNTVALUE}}',
    is_all_product: '{{#? ISALLPRODUCT}}',
    is_appoint_product: '{{#? ISAPPOINTPRODUCT}}',
    is_all_customer_type: '{{#? ISALLCUSTOMERTYPE}}',
    is_apppoint_customer_type: '{{#? ISAPPOINTCUSTOMERTYPE}}',
    is_apply_orther_discount: '{{#? ISAPPLYOTHERDISCOUNT}}',
    is_none_requirement: '{{#? ISNONEREQUIREMENT}}',
    is_min_total_money: '{{#? ISMINTOTALMONEY}}',
    value_min_total_money: '{{#? VALUEMINTOTALMONEY}}',
    is_min_num_product: '{{#? ISMINNUMPRODUCT}}',
    value_min_num_product: '{{#? VALUEMINNUMPRODUCT}}',
    discount_status: '{{#? DISCOUNTSTATUS}}',
    customertype_id: '{{#? CUSTOMERTYPEID}}',
    start_date: '{{#? STARTDATE}}',
    end_date: '{{#? ENDDATE}}',
    create_date: '{{#? CREATEDDATEVIEW}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    note: '{{#? NOTE}}',
    is_combo: "{{ISCOMBO ? 1 : 0}}",
    temp_id: '{{#? TEMPID}}',
    combo_id: '{{#? COMBOID}}'
};

let transform = new Transform(template);

const optionsProduct = (data = []) => {
    return transform.transform(data, ['product_id', 'combo_id', 'product_name','is_combo', 'temp_id']);
};
const optionsCustomer = (data = []) => {
    return transform.transform(data, ['customer_type_id', 'customer_type_name']);
};

const list = (data = []) => {
    return transform.transform(data, [
        'discount_id',
        'discount_code',
        'is_percent_discount',
        'is_money_discount',
        'discount_value',
        'discount_status',
        'start_date',
        'end_date',
        'create_date',
        'is_active',
    ]);
};

const detail = (data = []) => {
    return transform.transform(data, [
        "discount_id",
        "discount_code",
        "is_percent_discount",
        'is_money_discount',
        "discount_value",
        "is_all_product",
        "is_appoint_product",
        "is_all_customer_type",
        "is_apppoint_customer_type",
        "is_apply_orther_discount",
        "is_none_requirement",
        "is_min_total_money",
        "value_min_total_money",
        "is_min_num_product",
        "value_min_num_product",
        "discount_status",
        'start_date',
        "end_date",
        'is_active',
        'note',
    ]);
};


module.exports = {
    optionsProduct,
    optionsCustomer,
    list,
    detail
};
