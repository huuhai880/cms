const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    order_id: '{{#? ORDERID}}',
    order_no: '{{#? ORDERNO}}',
    order_date: '{{#? ORDERDATE}}',
    combo_name: '{{#? COMBONAME}}',
    status: '{{STATUS ? 1 : 0}}',
    total: '{{#? TOTALMONEY}}',
    total_discount: '{{#? TOTALDISCOUNT}}',
    sub_total: '{{#? SUBTOTAL}}',
    full_name: '{{#? FULLNAME}}',
    address: '{{#? ADDRESS}}',
    email: '{{#? EMAIL}}',
    phone_number: '{{#? PHONENUMBER}}',
    quantity: '{{#? QUANTITY}}',
    price: '{{#? PRICE}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_id: '{{#? PRODUCTID}}',
    combo_id: '{{#? COMBOID}}',
    is_combo: '{{ISCOMBO ? 1 : 0}}',
    temp_id: '{{#? TEMPID}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    member_id: '{{#? MEMBERID}}',
    price: '{{#? PRICE}}',
    order_type: '{{#? ORDERTYPE}}',
    is_grow_revenue: '{{ISGROWREVENUE ? 1 : 0}}',
    order_detail_id: '{{#? ORDERDETAILID}}',

    total_order: '{{#? TOTALORDER}}',
    total_quantity: '{{#? TOTALQUANTITY}}',
    total_amount: '{{#? TOTALAMOUNT}}'
};
let transform = new Transform(template);

const list = (data = []) => {
    return transform.transform(data, [
        'product_name',
        'order_no',
        'order_id',
        'order_date',
        'status',
        'total',
        'full_name',
        'phone_number',
        'combo_name',
        'order_type',
        'customer_name'
    ]);
};

const detailOrder = (order = []) => {
    return transform.transform(order, [
        'order_id',
        'order_no',
        'status',
        'total',
        'order_date',
        'full_name',
        'phone_number',
        'address',
        'email',
        'total_discount',
        'sub_total',
        'member_id',
        'order_type',
        'is_grow_revenue',
        'customer_name'
    ]);
};

const listCustomer = (data = []) => {
    return transform.transform(data, [
        'member_id',
        'full_name',
        'email',
        'address',
        'phone_number',
        'customer_name'
    ]);
};

const listProductCombo = (data = []) => {
    return transform.transform(data, [
        'product_id',
        'combo_id',
        'product_name',
        'is_combo',
        'temp_id',
        'price'
    ]);
};

const listOrderDetail = (data = []) => {
    return transform.transform(data, [
        'order_detail_id',
        'order_id',
        'product_id',
        'combo_id',
        'is_combo',
        'price',
        'quantity',
        'sub_total',
        'product_name',
        'temp_id'
    ]);
};


const report = (data = {}) => {
    return Object.keys(data).length > 0 ? transform.transform(data, [
        'total_order',
        'total_quantity',
        'total_amount',
    ]) : null;
};



module.exports = {
    list,
    detailOrder,
    listCustomer,
    listProductCombo,
    listOrderDetail,
    report
};
