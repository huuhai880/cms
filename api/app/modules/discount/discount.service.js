const discountClass = require('./discount.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');


const getOptions = async () => {
    try {
        const pool = await mssql.pool;
        const req = await pool.request()
            .execute(PROCEDURE_NAME.PRO_DISCOUNT_GETOPTION_ADMINWEB);
        const resProduct = discountClass.optionsProduct(req.recordsets[0])
        const resCustomer = discountClass.optionsCustomer(req.recordsets[1])
        return new ServiceResponse(true, "", {
            resProduct,
            resCustomer
        });
    } catch (e) {
        logger.error(e, { 'function': 'discountService.getOption' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdateDiscount = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {

        //Check mã code đã tồn tại hay chưa
        const res = await pool.request()
            .input('DISCOUNTID', apiHelper.getValueFromObject(body, 'discount_id'))
            .input('DISCOUNTCODE', apiHelper.getValueFromObject(body, 'discount_code'))
            .execute(PROCEDURE_NAME.PRO_DISCOUNT_CHECKDISCOUNT_ADMINWEB);

        if (res.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, 'Mã Code khuyến mãi đã tồn tại.');
        }

        let _discount_id = apiHelper.getValueFromObject(body, 'discount_id', null);
        let authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator')

        await transaction.begin();

        const requestDiscount = new sql.Request(transaction);
        const resultDiscount = await requestDiscount
            .input('DISCOUNTID', apiHelper.getValueFromObject(body, 'discount_id'))
            .input('DISCOUNTCODE', apiHelper.getValueFromObject(body, 'discount_code'))
            .input('ISPERCENTDISCOUNT', apiHelper.getValueFromObject(body, 'is_percent_discount'))
            .input('ISMONEYDISCOUNT', apiHelper.getValueFromObject(body, 'is_money_discount'))
            .input('DISCOUNTVALUE', apiHelper.getValueFromObject(body, 'discount_value'))
            .input('ISALLPRODUCT', apiHelper.getValueFromObject(body, 'is_all_product'))
            .input('ISAPPOINTPRODUCT', apiHelper.getValueFromObject(body, 'is_appoint_product'))
            .input('ISALLCUSTOMERTYPE', apiHelper.getValueFromObject(body, 'is_all_customer_type'))
            .input('ISAPPOINTCUSTOMERTYPE', apiHelper.getValueFromObject(body, 'is_apppoint_customer_type'))
            .input('ISAPPLYOTHERDISCOUNT', apiHelper.getValueFromObject(body, 'is_apply_orther_discount'))
            .input('ISNONEREQUIREMENT', apiHelper.getValueFromObject(body, 'is_none_requirement'))
            .input('ISMINTOTALMONEY', apiHelper.getValueFromObject(body, 'is_min_total_money'))
            .input('VALUEMINTOTALMONEY', apiHelper.getValueFromObject(body, 'value_min_total_money'))
            .input('ISMINNUMPRODUCT', apiHelper.getValueFromObject(body, 'is_min_num_product'))
            .input('VALUEMINNUMPRODUCT', apiHelper.getValueFromObject(body, 'value_min_num_product'))
            .input('NOTE', apiHelper.getValueFromObject(body, 'note'))
            .input('STARTDATE', apiHelper.getValueFromObject(body, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(body, 'end_date'))
            .input('DISCOUNTSTATUS', apiHelper.getValueFromObject(body, 'discount_status'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.PRO_DISCOUNT_CREATEORUPDATE_ADMINWEB);

        const discount_id = resultDiscount.recordset[0].RESULT;

        if (discount_id <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo mã khuyến mãi');
        }

        const product_list = apiHelper.getValueFromObject(body, 'product_list', []);
        const customer_type_list = apiHelper.getValueFromObject(body, 'customer_type_list', []);
        const is_appoint_product = apiHelper.getValueFromObject(body, 'is_appoint_product', false);
        const is_apppoint_customer_type = apiHelper.getValueFromObject(body, 'is_apppoint_customer_type', false);
        

        if (_discount_id) {
            //Delete sản phẩm theo mã khuyễn mãi
            const reqDelProduct = new sql.Request(transaction);
            await reqDelProduct
                .input('DISCOUNTID', discount_id)
                .input('DELETEDUSER', authName)
                .execute(PROCEDURE_NAME.PRO_DISCOUNT_PRODUCT_DELETE_ADMINWEB);

            //Delete loại khách hàng ap dung khuyến mãi
            const reqDelCustomerType = new sql.Request(transaction);
            await reqDelCustomerType
                .input('DISCOUNTID', discount_id)
                .input('DELETEDUSER', authName)
                .execute(PROCEDURE_NAME.PRO_DISCOUNT_CUSTOMERTYPE_DELETE_ADMINWEB);
        }

        if (product_list && product_list.length && is_appoint_product) {
            const reqInsProduct = new sql.Request(transaction);
            for (let i = 0; i < product_list.length; i++) {
                let item = product_list[i]
                await reqInsProduct
                    .input('DISCOUNTID', discount_id)
                    .input('PRODUCTID', item.product_id)
                    .input('COMBOID', item.combo_id)
                    .input('ISCOMBO', item.is_combo)
                    .input('CREATEDUSER', authName)
                    .execute(PROCEDURE_NAME.PRO_DISCOUNT_PRODUCT_CREATEORUPDATE_ADMINWEB);
            }
        }

        if (customer_type_list && customer_type_list.length && is_apppoint_customer_type) {
            const reqInsCustomerType = new sql.Request(transaction);
            for (let i = 0; i < customer_type_list.length; i++) {
                let item = customer_type_list[i]
                await reqInsCustomerType
                    .input('DISCOUNTID', discount_id)
                    .input('CUSTOMERTYPEID', item.customer_type_id)
                    .input('CREATEDUSER', authName)
                    .execute(PROCEDURE_NAME.PRO_DISCOUNT_CUSTOMERTYPE_CREATEORUPDATE_ADMINWEB);
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', discount_id);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'discountService.createOrUpdateDiscount',
        });
        console.error('discountService.createOrUpdateDiscount', error);
        return new ServiceResponse(false, error.message);
    }
};

const getListDiscount = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'startDate'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'endDate'))
            .input('DISCOUNTSTATUS', apiHelper.getValueFromObject(queryParams, 'status'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'isActive'))
            .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'isDeleted'))
            .execute(PROCEDURE_NAME.PRO_DISCOUNT_GETLIST_AdminWeb);

        const result = data.recordsets[0];

        return new ServiceResponse(true, '', {
            data: discountClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[1]),
        });
    } catch (e) {
        logger.error(e, {
            function: 'discountService.getListDiscount',
        });

        return new ServiceResponse(false, '', {});
    }
};

const getDiscountDetail = async (discount_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DISCOUNTID', discount_id)
            .execute(PROCEDURE_NAME.PRO_DISCOUNT_GETDETAILBYID_ADMINWEB);
        const result = {
            ...discountClass.detail(data.recordsets[0][0]),
            customer_type_list: discountClass.optionsCustomer(data.recordsets[1]),
            product_list: discountClass.optionsProduct(data.recordsets[2])
        };
        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'discountService.getDiscountDetail',
        });

        return new ServiceResponse(false, '', {});
    }
}

const deleteDiscount = async (discount_id, body = {}) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('DISCOUNTID', discount_id)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.PRO_DISCOUNT_DELETE_ADMINWEB);

        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, {
            function: 'discountService.deleteDiscount',
        });

        return new ServiceResponse(false, '', {});
    }
}

module.exports = {
    getOptions,
    createOrUpdateDiscount,
    getListDiscount,
    getDiscountDetail,
    deleteDiscount
};
