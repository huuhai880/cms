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
const productComboClass = require('./product-combo.class');


const getListCombo = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const is_active = apiHelper.getValueFromObject(queryParams, 'is_active', 2);
        const is_web_view = apiHelper.getValueFromObject(queryParams, 'is_web_view', 2);
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null)

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('keyword', keyword)
            .input('startdate', start_date)
            .input('enddate', end_date)
            .input('isactive', is_active)
            .input('ISSHOWWEB', is_web_view)
            .input('pagesize', itemsPerPage)
            .input('pageindex', currentPage)
            .execute('PRO_COMBOS_GetList_AdminWeb');

        let list = productComboClass.listCombo(res.recordset);
        let total = apiHelper.getTotalData(res.recordset);

        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'product-combo.service.getListCombo',
        });
        return new ServiceResponse(false, error.message);
    }
}

const createCombo = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {

        let combo_image_url = apiHelper.getValueFromObject(bodyParams, 'combo_image_url', null);
        if (combo_image_url) {
            const path_combo_image_url = await saveImage('productcombo', combo_image_url);
            if (path_combo_image_url) {
                combo_image_url = path_combo_image_url;
            }
            else {
                return new ServiceResponse(false, RESPONSE_MSG.NEWS.UPLOAD_FAILED);
            }
        }

        await transaction.begin();

        const reqCombo = new sql.Request(transaction);
        const resCombo = await reqCombo
            .input('comboname', apiHelper.getValueFromObject(bodyParams, 'combo_name', ''))
            .input('description', apiHelper.getValueFromObject(bodyParams, 'description', ''))
            .input('comboimageurl', combo_image_url)
            .input('isactive', apiHelper.getValueFromObject(bodyParams, 'is_active', 0))
            .input('COMBOCONTENTDETAIL', apiHelper.getValueFromObject(bodyParams, 'content_detail', ''))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_web_view', 0))
            .input('ISSHOWMENU', apiHelper.getValueFromObject(bodyParams, 'is_show_menu', 0))
            .input('createduser', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('PRO_COMBOS_Create_AdminWeb')

        let { combo_id } = resCombo.recordset[0];
        if (!combo_id) {
            await transaction.rollback();
            return new ServiceResponse(
                false,
                "Lỗi thêm mới combo",
                null
            );
        }

        let combo_products = apiHelper.getValueFromObject(bodyParams, 'combo_products', []);
        if (combo_products && combo_products.length > 0) {
            const reqProduct = new sql.Request(transaction);
            for (let index = 0; index < combo_products.length; index++) {
                const pro_combo = combo_products[index];
                const resProduct = await reqProduct
                    .input('comboid', combo_id)
                    .input('productid', pro_combo.product_id)
                    .input('numbersearch', pro_combo.number_search)
                    .input('istimelimit', pro_combo.is_time_limit)
                    .input('timelimit', pro_combo.time_limit)
                    .input('createduser', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
                    .execute('PRO_COMBOPRODUCT_Create_AdminWeb')
            }
        }

        await transaction.commit();

        return new ServiceResponse(true, "", true)
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'product-combo.service.createCombo',
        });
        return new ServiceResponse(false, error.message);
    }
}

const updateCombo = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        let combo_image_url = apiHelper.getValueFromObject(bodyParams, 'combo_image_url', null);
        if (combo_image_url) {
            const path_combo_image_url = await saveImage('productcombo', combo_image_url);
            if (path_combo_image_url) {
                combo_image_url = path_combo_image_url;
            }
            else {
                return new ServiceResponse(false, RESPONSE_MSG.NEWS.UPLOAD_FAILED);
            }
        }

        let combo_id = apiHelper.getValueFromObject(bodyParams, 'combo_id', 0);


        await transaction.begin();

        const reqCombo = new sql.Request(transaction);
        const resCombo = await reqCombo
            .input('comboid', combo_id)
            .input('comboname', apiHelper.getValueFromObject(bodyParams, 'combo_name', ''))
            .input('description', apiHelper.getValueFromObject(bodyParams, 'description', ''))
            .input('comboimageurl', combo_image_url)
            .input('isactive', apiHelper.getValueFromObject(bodyParams, 'is_active', 0))
            .input('COMBOCONTENTDETAIL', apiHelper.getValueFromObject(bodyParams, 'content_detail', ''))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_web_view', 0))
            .input('ISSHOWMENU', apiHelper.getValueFromObject(bodyParams, 'is_show_menu', 0))
            .input('updateduser', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('PRO_COMBOS_Update_AdminWeb')

        let { result } = resCombo.recordset[0];
        if (result == 0) {
            await transaction.rollback();
            return new ServiceResponse(
                false,
                "Lỗi cập nhật combo",
                null
            );
        }

        //Product
        const reqDelProduct = new sql.Request(transaction);
        await reqDelProduct
            .input('comboid', combo_id)
            .input('deleteduser', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('PRO_COMBOPRODUCT_Delete_AdminWeb')

        let combo_products = apiHelper.getValueFromObject(bodyParams, 'combo_products', []);
        if (combo_products && combo_products.length > 0) {
            const reqProduct = new sql.Request(transaction);

            for (let index = 0; index < combo_products.length; index++) {
                const product = combo_products[index];
                const resProduct = await reqProduct
                    .input('comboid', combo_id)
                    .input('productid', product.product_id)
                    .input('numbersearch', product.number_search)
                    .input('istimelimit', product.is_time_limit)
                    .input('timelimit', product.time_limit)
                    .input('updateduser', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
                    .execute('PRO_COMBOPRODUCT_Update_AdminWeb')
            }

        }
        await transaction.commit();
        return new ServiceResponse(true, "", true)
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'product-combo.service.updateCombo',
        });
        return new ServiceResponse(false, error.message);
    }
}

const detailCombo = async (combo_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('comboid', combo_id)
            .execute('PRO_COMBOS_GetById_AdminWeb')

        let combo = productComboClass.detailCombo(res.recordsets[0][0])
        let combo_products = productComboClass.listComboProduct(res.recordsets[1]);
        if (combo) {
            combo.combo_products = combo_products ? combo_products : []
        }
        return new ServiceResponse(true, "", combo)
    } catch (error) {
        logger.error(error, {
            function: 'product-combo.service.detailCombo',
        });
        return new ServiceResponse(false, error.message);
    }
}

const deleteCombo = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        await pool.request()
            .input('comboid', apiHelper.getValueFromObject(bodyParams, 'combo_id', 0))
            .input('deleteduser', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('PRO_COMBOS_Delete_AdminWeb')

        return new ServiceResponse(true, "", true)
    } catch (error) {
        logger.error(error, {
            function: 'product-combo.service.deleteCombo',
        });
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getListCombo,
    createCombo,
    updateCombo,
    detailCombo,
    deleteCombo
}