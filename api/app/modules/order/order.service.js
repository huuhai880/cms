const OrderClass = require('./order.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getOrderList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        let keyword = apiHelper.getValueFromObject(queryParams, 'keyword', null);
        let order_status = apiHelper.getValueFromObject(queryParams, 'order_status', 2);
        let is_deleted = apiHelper.getValueFromObject(queryParams, 'is_deleted', 0);
        let start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        let end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null);
        let product_id = apiHelper.getValueFromObject(queryParams, 'product_id', null);
        let combo_id = apiHelper.getValueFromObject(queryParams, 'combo_id', null);
        let from_price = apiHelper.getValueFromObject(queryParams, 'from_price', 0);
        let to_price = apiHelper.getValueFromObject(queryParams, 'to_price', 0);
        let order_type = apiHelper.getValueFromObject(queryParams, 'order_type', 2);
        let is_combo = apiHelper.getValueFromObject(queryParams, 'is_combo', false);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('PRODUCTID', product_id)
            .input('COMBOID', combo_id)
            .input('ISCOMBO', is_combo)
            .input('STARTDATE', start_date)
            .input('ENDDATE', end_date)
            .input('FROMPRICE', from_price)
            .input('TOPRICE', to_price)
            .input('ORDERSTATUS', order_status)
            .input('ORDERTYPE', order_type)
            .input('ISDELETED', is_deleted)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('SL_ORDER_GetList_AdminWeb');

        let orders = OrderClass.list(data.recordsets[0]);
        let report = OrderClass.report(data.recordsets[1][0])

        let orderIds = (orders || []).map(i => i.order_id).join(",");
        if (orderIds) {
            const resDetail = await pool.request()
                .input('orderids', orderIds)
                .execute('SL_ORDERDETAIL_GetByListId_AdminWeb');

            let listDetail = OrderClass.listOrderDetail(resDetail.recordset);
            for (let i = 0; i < orders.length; i++) {
                let item = orders[i];
                let _details = listDetail.filter(p => p.order_id == item.order_id) || [];
                let product_name = _details.map(p => {
                    return `<span>${p.product_name}</span>`
                }).join("");
                item.product_name = product_name
            }
        }

        return new ServiceResponse(true, '', {
            data: orders,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
            report
        });
    } catch (e) {
        logger.error(e, {
            function: 'order.service.getOrderList',
        });

        return new ServiceResponse(true, '', {});
    }
};

const detailOrder = async (order_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', order_id)
            .execute('SL_ORDER_GetbyId_AdminWeb');

        let order = OrderClass.detailOrder(data.recordsets[0][0]);
        let order_details = OrderClass.listOrderDetail(data.recordsets[1]);
        let discount = OrderClass.discountDetail(data.recordsets[2][0] || {})
        order.order_details = order_details || [];
        order.discount = discount;
        return new ServiceResponse(true, '', order);
    } catch (e) {
        logger.error(e, {
            function: 'order.service.detailOrder',
        });

        return new ServiceResponse(false, e.message);
    }
};


const deleteOrder = async (order_id, body) => {
    const pool = await mssql.pool;
    try {
        await pool
            .request()
            .input('ORDERID', order_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SL_ORDER_Delete_AdminWeb');
        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, {
            function: 'order.service.deleteOrder',
        });
        return new ServiceResponse(false, e.message);
    }
};


const initCreateOrder = async (order_id = 0) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('ORDERID', order_id)
            .execute('SL_ORDER_Init_AdminWeb');

        let { order_no = '' } = res.recordsets[0][0];
        let listCustomer = OrderClass.listCustomer(res.recordsets[1]);
        let listProductCombo = OrderClass.listProductCombo(res.recordsets[2]) || [];
        let listOrderDetails = OrderClass.listOrderDetail(res.recordsets[3]) || [];

        for (let i = 0; i < listProductCombo.length; i++) {
            let pro = listProductCombo[i];
            let find = listOrderDetails.find(p => p.temp_id == pro.temp_id);
            if (find) {
                let { price = 0 } = find || {};
                pro.price = price
            }
        }
        return new ServiceResponse(true, '', { order_no, listCustomer, listProductCombo })
    } catch (error) {
        logger.error(error, {
            function: 'order.service.initCreateOrder'
        });
        return new ServiceResponse(false, e.message);
    }
}


const createOrUpdateOrder = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id', 0);
        let full_name = apiHelper.getValueFromObject(bodyParams, 'full_name', '');
        let email = apiHelper.getValueFromObject(bodyParams, 'email', '');
        let phone_number = apiHelper.getValueFromObject(bodyParams, 'phone_number', '');
        let address = apiHelper.getValueFromObject(bodyParams, 'address', '');
        let status = apiHelper.getValueFromObject(bodyParams, 'status', false);
        let order_details = apiHelper.getValueFromObject(bodyParams, 'order_details', []);
        let order_id = apiHelper.getValueFromObject(bodyParams, 'order_id', 0);
        let auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        let order_no = apiHelper.getValueFromObject(bodyParams, 'order_no');
        let is_grow_revenue = apiHelper.getValueFromObject(bodyParams, 'is_grow_revenue', false);
        let discount = apiHelper.getValueFromObject(bodyParams, 'discount', null);
        let referral_code = apiHelper.getValueFromObject(bodyParams, 'referral_code', null);

        await transaction.begin();

        if (order_details && order_details.length > 0) {
            let sub_total = 0;
            let total_discount = 0;

            order_details.forEach(item => {
                sub_total += item.quantity * item.price;
                item.sub_total = item.quantity * item.price;
            });

            if (discount) {
                let { discount_money = 0 } = discount || {};
                total_discount = discount_money;
            }

            let total_money = sub_total - total_discount;


            //Insert Order
            const reqOrder = new sql.Request(transaction);
            const resOrder = await reqOrder
                .input('ORDERID', order_id)
                .input('ORDERNO', order_no)
                .input('STATUS', status)
                .input('MEMBERID', member_id)
                .input('EMAIL', email)
                .input('PHONENUMBER', phone_number)
                .input('ADDRESS', address)
                .input('TOTALMONEY', total_money)
                .input('TOTALDISCOUNT', total_discount)
                .input('SUBTOTAL', sub_total)
                .input('TOTALSHIPFEE', null)
                .input('ISGROWREVENUE', is_grow_revenue)
                .input('CREATEDUSER', auth_name)
                .input('REFERRALCODE', referral_code)
                .execute('SL_ORDER_CreateOrUpdate_AdminWeb')

            let { order_id: order_id_result, order_no: order_no_result } = resOrder.recordset[0];

            //Delete Order Detail
            if (order_id && order_id > 0) {
                const reqDelDetail = new sql.Request(transaction);

                //Delete Order detail
                await reqDelDetail
                    .input('ORDERID', order_id)
                    .input('DELETEDUSER', auth_name)
                    .execute('SL_ORDERDETAIL_Delete_AdminWeb')

                //Delete Discount neu co
                const reqDelDiscount = new sql.Request(transaction);
                await reqDelDiscount
                    .input('ORDERID', order_id)
                    .input('DELETEDUSER', auth_name)
                    .execute('SL_ORDER_DISCOUNT_Delete_AdminWeb')

            }

            //Insert/Update Order Detail
            const reqOrderDetail = new sql.Request(transaction);
            for (let i = 0; i < order_details.length; i++) {
                let detail = order_details[i];
                await reqOrderDetail
                    .input('MEMBERID', member_id)
                    .input('ORDERID', order_id_result)
                    .input('PRODUCTID', detail.product_id)
                    .input('COMBOID', detail.combo_id)
                    .input('ISCOMBO', detail.is_combo)
                    .input('QUANTITY', detail.quantity)
                    .input('PRICE', detail.price)
                    .input('TOTALAMOUNT', detail.sub_total)
                    .input('CREATEDUSER', auth_name)
                    .execute('SL_ORDERDETAIL_CreateOrUpdate_AdminWeb')
            }

            //Nếu có chọn mã khuyến mãi
            if (discount) {
                const reqOrderDiscount = new sql.Request(transaction);
                await reqOrderDiscount
                    .input('ORDERID', order_id_result)
                    .input('DISCOUNTID', discount.discount_id)
                    .input('DISCOUNTCODE', discount.discount_code)
                    .input('DISCOUNTMONEY', discount.discount_money)
                    .input('CREATEDUSER', auth_name)
                    .execute('SL_ORDER_DISCOUNT_Create_AdminWeb')
            }

            //NEU LA THANH TOAN THI TAO RECEIPT
            if (status == 1) {
                const reqReceipt = new sql.Request(transaction);
                await reqReceipt
                    .input('ORDERID', order_id_result)
                    .input('MEMBERID', member_id)
                    .input('TOTALMONEY', total_money)
                    .input('TOTALPAID', total_money)
                    .input('CREATEDUSER', auth_name)
                    .execute('SL_RECEIPTS_Create_AdminWeb')
            }

            await transaction.commit();
            return new ServiceResponse(true, '', { order_id_result, order_no_result });
        }
        else {
            await transaction.rollback();
            return new ServiceResponse(false, 'Đơn hàng không có sản phẩm nào. Vui lòng thực hiện lại.');
        }
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: "order.service.createOrder",
        });
        return new ServiceResponse(false, "Lỗi tạo đơn hàng.");
    }
}

const getOptionProductCombo = async () => {
    try {
        let pool = await mssql.pool;
        let res = await pool.request().execute('SL_ORDER_PRODUCTCOMBO_List_AdminWeb');
        return new ServiceResponse(true, '', OrderClass.listProductCombo(res.recordset) || [])
    } catch (error) {
        logger.error(error, {
            function: "order.service.getOptionProductCombo",
        });
        return new ServiceResponse(false, "Lỗi lấy danh sách sản phẩm/combo.");
    }
}

const getListDiscountApply = async (bodyParams = {}) => {
    try {
        let order_details = apiHelper.getValueFromObject(bodyParams, 'order_details', []);
        let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id', null);

        if (order_details.length == 0) {
            return new ServiceResponse(true, '', [])
        }

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('memberid', member_id)
            .execute('PRO_DISCOUNT_GetListApply_AdminWeb');

        let listDiscount = OrderClass.listDiscount(res.recordsets[0]);
        let listDiscountProduct = OrderClass.listDiscountProduct(res.recordsets[1]);
        let listDiscountCustomerType = OrderClass.listDiscountProduct(res.recordsets[2]);
        let { customer_type_id = 0 } = res.recordsets[3][0] || {}

        for (let i = 0; i < listDiscount.length; i++) {
            let _discount = listDiscount[i];
            let product_apply = listDiscountProduct.filter(p => p.discount_id == _discount.discount_id);
            _discount.product_apply = product_apply || [];
            let customer_type_apply = listDiscountCustomerType.filter(p => p.discount_id == _discount.discount_id);
            _discount.customer_type_apply = customer_type_apply || [];
        }

        let sub_total = 0;
        let total_quantity = 0;
        order_details.forEach(item => {
            sub_total += item.quantity * item.price;
            total_quantity += (1 * item.quantity)
        })

        //Duyêt danh sách khuyến mãi để check điều kiện
        let listDiscountApply = [];
        for (let k = 0; k < listDiscount.length; k++) {
            let _discount = listDiscount[k];
            let {
                is_percent_discount,
                discount_value,
                is_appoint_product,
                is_appoint_customer_type,
                is_min_total_money,
                value_min_total_money,
                is_min_num_product,
                value_min_num_product,
                product_apply = [],
                customer_type_apply = []
            } = _discount || {}

            //Chỉ định sản phẩm
            if (is_appoint_product) {
                const checkProduct = order_details.filter((x) => {
                    return product_apply.find((y) => (x.product_id == y.product_id && !x.is_combo) ||
                        (x.product_id == y.combo_id && x.is_combo))
                })
                if (!checkProduct.length) {
                    continue;
                }
            }

            //Chỉ định Loại khách hàng
            if (is_appoint_customer_type) {
                const checkCustomerType = customer_type_apply.findIndex((x) => x.customertype_id == customer_type_id);
                if (checkCustomerType == -1) {
                    continue;
                }
            }

            //Kiểm tra số tiền tối thiểu
            if (is_min_total_money && value_min_total_money > sub_total) {
                continue;
            }

            //Kiểm tra số lượng tối thiểu
            if (is_min_num_product && value_min_num_product > total_quantity) {
                continue;
            }


            //Tính giá trị discount
            let discount_money = 0;
            if (is_percent_discount) {
                discount_money = discount_value * (1 * sub_total) / 100
            } else {
                discount_money = discount_value
            }
            _discount.discount_money = discount_money;

            let _discount_apply = {
                discount_id: _discount.discount_id,
                discount_code: _discount.discount_code,
                end_date: _discount.end_date,
                start_date: _discount.start_date,
                is_percent_discount,
                discount_value,
                discount_money
            }

            listDiscountApply.push(_discount_apply)
        }
        return new ServiceResponse(true, "", listDiscountApply)
    } catch (error) {
        logger.error(error, {
            function: "order.service.getListDiscountApply",
        });
        return new ServiceResponse(false, "Lỗi lấy danh sách khuyến mãi thoả điều kiện.");
    }
}

module.exports = {
    getOrderList,
    detailOrder,
    deleteOrder,
    initCreateOrder,
    createOrUpdateOrder,
    getOptionProductCombo,
    getListDiscountApply
};
