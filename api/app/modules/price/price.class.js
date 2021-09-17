const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    price_id: "{{#? PRICEID}}",
    product_id: '{{#? PRODUCTID}}',
    product_name: "{{#? PRODUCTNAME}}",
    combo_id: "{{#? COMBOID}}",
    is_active: "{{ISACTIVE ? 1 : 0}}",
    created_date: "{{#? CREATEDDATEVIEW}}",
    created_user: "{{#? CREATEDUSER}}",
    created_user_full_name: "{{#? CREATEDUSERFULLNAME}}",
    is_apply_combo: "{{ISAPPLYCOMBO ? 1 : 0}}",
    is_percent: '{{ISPERCENT ? 1 : 0}}',
    discount_value: "{{#? DISCOUNTVALUE}}",
    price: "{{#? PRICE}}",
    combo_name: '{{#? COMBONAME}}',
    is_apply_promotion: "{{ISAPPLYPROMOTION ? 1 : 0}}",
    price_display_name: "{{#? PRICEDISPLAYNAME}}",
    customer_type_id: "{{#? CUSTOMERTYPEID}}",
    customer_type_name: "{{#? CUSTOMERTYPENAME}}",
    from_date: '{{#? FROMDATE}}',
    to_date: '{{#? TODATE}}',
    is_apply_price: "{{ISAPPLYPRICE ? 1 : 0}}",
    new_sale_price: "{{#? NEWSALEPRICE}}",
    time_apply_price_new: "{{#? TIMEAPPLYPRICENEW}}",
}

let transform = new Transform(template);

const listPrice = (list = []) => {
    return transform.transform(list, [
        'price_id',
        'product_id',
        'product_name',
        'combo_id',
        'combo_name',
        'is_active',
        'created_user',
        'created_date',
        'is_percent',
        'discount_value',
        'price',
        'is_apply_combo',
        'is_apply_promotion',
        'created_date',
        'price_display_name',
        'new_sale_price',
        'time_apply_price_new'
    ]);
};

const detailPrice = (price = {}) => {
    return Object.keys(price).length > 0 ? transform.transform(price, [
        'price_id',
        'product_id',
        'combo_id',
        'product_name',
        'combo_name',
        'is_apply_combo',
        'price',
        'is_apply_promotion',
        'is_percent',
        'discount_value',
        'from_date',
        'to_date',
        'is_active'
    ]) : null;
}

const listApplyCustomerType = (list = []) => {
    return transform.transform(list, [
        'price_id',
        'product_id',
        'combo_id',
        'customer_type_id',
        'customer_type_name',
        'is_apply_promotion',
        'is_apply_price'
    ]);
};


module.exports = {
    listPrice,
    detailPrice,
    listApplyCustomerType
}