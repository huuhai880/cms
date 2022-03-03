const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { saveImage } = require('../../common/helpers/saveFile.helper');
const pageClass = require('./page.class');

const getListPage = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const is_active = apiHelper.getValueFromObject(queryParams, 'is_active', 2);
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null)

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('keyword', keyword)
            .input('startdate', start_date)
            .input('enddate', end_date)
            .input('isactive', is_active)
            .input('pagesize', itemsPerPage)
            .input('pageindex', currentPage)
            .execute('MD_PAGE_GetList_AdminWeb');

        let list = pageClass.list(res.recordset);
        let total = apiHelper.getTotalData(res.recordset);

        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'page.service.getListPage',
        });
        return new ServiceResponse(false, error.message);
    }
}

const detailPage = async (page_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('pageid', page_id)
            .execute('MD_PAGE_GetById_AdminWeb')
        let page = pageClass.detail(res.recordset[0])
        return new ServiceResponse(true, "", page)
    } catch (error) {
        logger.error(error, {
            function: 'page.service.detailPage',
        });
        return new ServiceResponse(false, error.message);
    }
}

const deletePage = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        await pool.request()
            .input('pageid', apiHelper.getValueFromObject(bodyParams, 'page_id', 0))
            .input('deleteduser', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('MD_PAGE_Delete_AdminWeb')

        return new ServiceResponse(true, "", true)
    } catch (error) {
        logger.error(error, {
            function: 'page.service.deletePage',
        });
        return new ServiceResponse(false, error.message);
    }
}

const createOrUpdatePage = async (bodyParams = {}) => {
    try {

        let page_id = apiHelper.getValueFromObject(bodyParams, 'page_id', 0);
        let page_name = apiHelper.getValueFromObject(bodyParams, 'page_name', '');
        let page_type = apiHelper.getValueFromObject(bodyParams, 'page_type', 0);
        let description = apiHelper.getValueFromObject(bodyParams, 'description', null);
        let short_description = apiHelper.getValueFromObject(bodyParams, 'short_description', null);
        let background_url = apiHelper.getValueFromObject(bodyParams, 'background_url', null);
        let is_active = apiHelper.getValueFromObject(bodyParams, 'is_active', 1);
        let auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let is_show_header = apiHelper.getValueFromObject(bodyParams, 'is_show_header', 1);
        let is_show_footer = apiHelper.getValueFromObject(bodyParams, 'is_show_footer', 1);

        if (background_url) {
            const path_background_url = await saveImage('page', background_url);
            if (path_background_url) {
                background_url = path_background_url;
            }
            else {
                return new ServiceResponse(false, 'Lỗi upload ảnh background page');
            }
        }

        const pool = await mssql.pool;
        await pool.request()
            .input('pageid', page_id)
            .input('pagename', page_name)
            .input('pagetype', page_type)
            .input('description', description)
            .input('shortdescription', short_description)
            .input('backgroundurl', background_url)
            .input('isactive', is_active)
            .input('createduser', auth_name)
            .input('isshowheader', is_show_header)
            .input('isshowfooter', is_show_footer)
            .execute('MD_PAGE_CreateOrUpdate_AdminWeb')

        return new ServiceResponse(true, "", true)
    } catch (error) {
        logger.error(error, {
            function: 'page.service.createOrUpdatePage',
        });
        return new ServiceResponse(false, error.message);
    }
}


module.exports = {
    getListPage,
    deletePage,
    detailPage,
    createOrUpdatePage
}


