const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const folderName = 'productpicture';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const { saveImage } = require('../../common/helpers/saveFile.helper');
const priceClass = require('./price.class');

const getListPrice = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const type = apiHelper.getValueFromObject(queryParams, 'is_active', 2);
        const is_active = apiHelper.getValueFromObject(queryParams, 'is_active', 1);
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null)

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('keyword', keyword)
            .input('type', type)
            .input('startdate', start_date)
            .input('enddate', end_date)
            .input('isactive', is_active)
            .input('pagesize', itemsPerPage)
            .input('pageindex', currentPage)
            .execute('SL_PRICE_GetList_AdminWeb');

        let list = priceClass.listPrice(res.recordset);
        let total = apiHelper.getTotalData(res.recordset);

        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'price.service.getListPrice',
        });
        return new ServiceResponse(false, error.message);
    }
}

const createPrice = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {

        let is_apply_combo = apiHelper.getValueFromObject(bodyParams, 'is_apply_combo', 0);
        let is_apply_promotion = apiHelper.getValueFromObject(bodyParams, 'is_apply_promotion', 0);
        let is_apply_customer_type = apiHelper.getValueFromObject(bodyParams, 'is_apply_customer_type', 0);
        let is_percent = apiHelper.getValueFromObject(bodyParams, 'is_percent', 0);
        let discount_value = apiHelper.getValueFromObject(bodyParams, 'discount_value', null);
        let products = apiHelper.getValueFromObject(bodyParams, 'products', []);
        let combos = apiHelper.getValueFromObject(bodyParams, 'combos', []);

        let customer_types = apiHelper.getValueFromObject(bodyParams, 'customer_types', []);
        let price = apiHelper.getValueFromObject(bodyParams, 'price', 0);
        let is_active = apiHelper.getValueFromObject(bodyParams, 'is_active', 0);
        let from_date = apiHelper.getValueFromObject(bodyParams, 'from_date', null);
        let to_date = apiHelper.getValueFromObject(bodyParams, 'to_date', null);
        let authName = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator')

        await transaction.begin();

        if (is_apply_combo) { //Lam gia Combo
            const reqPriceCombo = new sql.Request(transaction);
            for (let i = 0; i < combos.length; i++) {
                const combo = combos[i];
                const resPriceCombo = await reqPriceCombo
                    .input('productid', null)
                    .input('price', price)
                    .input('isapplypromotion', is_apply_promotion)
                    .input('ispercent', is_percent)
                    .input('discountvalue', discount_value)
                    .input('fromdate', from_date)
                    .input('todate', to_date)
                    .input('isapplycombo', is_apply_combo)
                    .input('comboid', combo.combo_id)
                    .input('isactive', is_active)
                    .input('createduser', authName)
                    .execute('SL_PRICE_Create_AdminWeb')

                let { price_id } = resPriceCombo.recordset[0];
                if (is_apply_customer_type && customer_types.length > 0) {
                    const reqCustomerType = new sql.Request(transaction);
                    for (let j = 0; j < customer_types.length; j++) {
                        const customerType = customer_types[j];
                        if (customerType.is_apply_promotion || customerType.is_apply_price) {
                            await reqCustomerType
                                .input('priceid', price_id)
                                .input('productid', null)
                                .input('comboid', combo.combo_id)
                                .input('customertypeid', customerType.customer_type_id)
                                .input('isapplypromotion', customerType.is_apply_promotion)
                                .input('isapplyprice', customerType.is_apply_price)
                                .input('createduser', authName)
                                .execute('SL_PRICE_APPLY_CUSTOMERTYPE_Create_AdminWeb')
                        }
                    }
                }
            }
        }
        else { //Lam gia san pham
            const reqPriceProduct = new sql.Request(transaction);
            for (let index = 0; index < products.length; index++) {
                const product = products[index];
                const resPriceProduct = await reqPriceProduct
                    .input('productid', product.product_id)
                    .input('price', price)
                    .input('isapplypromotion', is_apply_promotion)
                    .input('ispercent', is_percent)
                    .input('discountvalue', discount_value)
                    .input('fromdate', from_date)
                    .input('todate', to_date)
                    .input('isapplycombo', is_apply_combo)
                    .input('comboid', null)
                    .input('isactive', is_active)
                    .input('createduser', authName)
                    .execute('SL_PRICE_Create_AdminWeb')

                let { price_id } = resPriceProduct.recordset[0];
                if (is_apply_customer_type && customer_types.length > 0) {
                    const reqCustomerType = new sql.Request(transaction);
                    for (let j = 0; j < customer_types.length; j++) {
                        const customerType = customer_types[j];
                        if (customerType.is_apply_promotion || customerType.is_apply_price) {
                            await reqCustomerType
                            .input('priceid', price_id)
                            .input('productid', product.product_id)
                            .input('comboid', null)
                            .input('customertypeid', customerType.customer_type_id)
                            .input('isapplypromotion', customerType.is_apply_promotion)
                            .input('isapplyprice', customerType.is_apply_price)
                            .input('createduser', authName)
                            .execute('SL_PRICE_APPLY_CUSTOMERTYPE_Create_AdminWeb')
                        }
                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, "", true)

    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'price.service.createPrice',
        });
        return new ServiceResponse(false, error.message);
    }
}


const detailPrice = async (price_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('priceid', price_id)
            .execute('SL_PRICE_GetById_AdminWeb')

        let price = priceClass.detailPrice(res.recordsets[0][0]);
        let customer_types = priceClass.listApplyCustomerType(res.recordsets[1]);
        if (price) {
            price.customer_types = customer_types ? customer_types : [];
            price.is_apply_customer_type = customer_types && customer_types.length > 0;
        }
        return new ServiceResponse(true, '', price)
    } catch (error) {
        logger.error(error, {
            function: 'price.service.detailPrice',
        });
        return new ServiceResponse(false, error.message);
    }
}

const deletePrice = async (bodyParams = {}) => {
    try {
        let authName = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator')
        let price_id = apiHelper.getValueFromObject(bodyParams, 'price_id', 0)
        const pool = await mssql.pool;
        await pool.request()
            .input('priceid', price_id)
            .input('deleteduser', authName)
            .execute('SL_PRICE_Delete_AdminWeb')

        return new ServiceResponse(true, '', true)
    } catch (error) {
        logger.error(error, {
            function: 'price.service.deletePrice',
        });
        return new ServiceResponse(false, error.message);
    }
}

const updatePrice = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        let price_id = apiHelper.getValueFromObject(bodyParams, 'price_id', 0);
        let is_apply_promotion = apiHelper.getValueFromObject(bodyParams, 'is_apply_promotion', 0);
        let is_apply_customer_type = apiHelper.getValueFromObject(bodyParams, 'is_apply_customer_type', 0);
        let is_percent = apiHelper.getValueFromObject(bodyParams, 'is_percent', 0);
        let discount_value = apiHelper.getValueFromObject(bodyParams, 'discount_value', null);
        let customer_types = apiHelper.getValueFromObject(bodyParams, 'customer_types', []);
        let price = apiHelper.getValueFromObject(bodyParams, 'price', 0);
        let is_active = apiHelper.getValueFromObject(bodyParams, 'is_active', 0);
        let from_date = apiHelper.getValueFromObject(bodyParams, 'from_date', null);
        let to_date = apiHelper.getValueFromObject(bodyParams, 'to_date', null);
        let authName = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator')
        let product_id = apiHelper.getValueFromObject(bodyParams, 'product_id', null);
        let combo_id = apiHelper.getValueFromObject(bodyParams, 'combo_id', null);

        await transaction.begin();

        const reqPrice = new sql.Request(transaction);
        await reqPrice
            .input('priceid', price_id)
            .input('price', price)
            .input('isapplypromotion', is_apply_promotion)
            .input('ispercent', is_percent)
            .input('discountvalue', discount_value)
            .input('fromdate', from_date)
            .input('todate', to_date)
            .input('isactive', is_active)
            .input('updateduser', authName)
            .execute('SL_PRICE_Update_AdminWeb')

        const reqDelCus = new sql.Request(transaction);
        await reqDelCus
            .input('priceid', price_id)
            .input('deleteduser', authName)
            .execute('SL_PRICE_APPLY_CUSTOMERTYPE_DeleteByPriceId_AdminWeb')

        if (is_apply_customer_type && customer_types.length > 0) {
            const reqCus = new sql.Request(transaction);
            for (let index = 0; index < customer_types.length; index++) {
                const customer_type = customer_types[index];
                if (customer_type.is_apply_promotion || customer_type.is_apply_price) {
                    await reqCus
                    .input('priceid', price_id)
                    .input('productid', product_id)
                    .input('comboid', combo_id)
                    .input('customertypeid', customer_type.customer_type_id)
                    .input('isapplypromotion', customer_type.is_apply_promotion)
                    .input('isapplyprice', customer_type.is_apply_price)
                    .input('updateduser', authName)
                    .execute('SL_PRICE_APPLY_CUSTOMERTYPE_Update_AdminWeb')
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, "", true)
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'price.service.updatePrice',
        });
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getListPrice,
    createPrice,
    detailPrice,
    deletePrice,
    updatePrice
}