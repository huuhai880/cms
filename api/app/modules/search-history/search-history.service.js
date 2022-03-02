const searchHistoryClass = require('./search-history.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListSearchHistoryFree = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const product_id = apiHelper.getValueFromObject(queryParams, 'product_id', null);
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null)
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('keyword', keyword)
            .input('startdate', start_date)
            .input('enddate', end_date)
            .input('productid', product_id)
            .input('pagesize', itemsPerPage)
            .input('pageindex', currentPage)
            .execute('CUS_SEARCHRESULT_FREE_GetList_AdminWeb');

        let list = searchHistoryClass.listFree(res.recordset);
        let total = apiHelper.getTotalData(res.recordset);
        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'search-history.service.getListSearchHistoryFree',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getOptionProduct = async() => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute('MD_PRODUCT_SEARCHHISTORY_GetOption_AdminWeb');
        return new ServiceResponse(true, "", res.recordset)
    } catch (error) {
        logger.error(error, {
            function: 'search-history.service.getOptionProduct',
        });
        return new ServiceResponse(false, error.message);
    }
}


module.exports = {
    getListSearchHistoryFree,
    getOptionProduct
};
