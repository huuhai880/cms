const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const paramOtherClass = require('./param-other.class')


const getListParamOther = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword', '');
        const is_active = apiHelper.getValueFromObject(queryParams, 'is_active', 1);

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('keyword', keyword)
            .input('isactive', is_active)
            .input('pageindex', currentPage)
            .input('pagesize', itemsPerPage)
            .execute('MD_PARAMOTHER_GetList_AdminWeb');

        let list = paramOtherClass.list(res.recordset);
        let total = apiHelper.getTotalData(res.recordset);
        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'param-other.service.getListParamOther',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getDetailParamOther = async (param_other_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('paramotherid', param_other_id)
            .execute('MD_PARAMOTHER_GetById_AdminWeb');

        return new ServiceResponse(true, "", paramOtherClass.detail(res.recordset[0]))
    } catch (error) {
        logger.error(error, {
            function: 'param-other.service.getDetailParamOther',
        });
        return new ServiceResponse(false, error.message);
    }
}

const deleteParamOther = async (param_other_id, authName) => {
    try {
        const pool = await mssql.pool;
        await pool.request()
            .input('paramotherid', param_other_id)
            .input('deleteduser', authName)
            .execute('MD_PARAMOTHER_Delete_AdminWeb');
        return new ServiceResponse(true, "", true)
    } catch (error) {
        logger.error(error, {
            function: 'param-other.service.deleteParamOther',
        });
        return new ServiceResponse(false, error.message);
    }
}

const createOrUpdParamOther = async (bodyParams = {}) => {
    try {
        let param_other_id = apiHelper.getValueFromObject(bodyParams, 'param_other_id', 0);
        let name_type = apiHelper.getValueFromObject(bodyParams, 'name_type', '');
        let is_house_number = apiHelper.getValueFromObject(bodyParams, 'is_house_number', false);
        let is_phone_number = apiHelper.getValueFromObject(bodyParams, 'is_phone_number', false);
        let is_license_plate = apiHelper.getValueFromObject(bodyParams, 'is_license_plate', false);
        let is_active = apiHelper.getValueFromObject(bodyParams, 'is_active', true);
        let auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('PARAMOTHERID', param_other_id)
            .input('NAMETYPE', name_type)
            .input('ISHOUSENUMBER', is_house_number)
            .input('ISPHONENUMBER', is_phone_number)
            .input('ISLICENSEPLATE', is_license_plate)
            .input('ISACTIVE', is_active)
            .input('CREATEDUSER', auth_name)
            .execute('MD_PARAMOTHER_CreateOrUpdate_AdminWeb');

        let { param_other_id: result } = res.recordset[0];

        return new ServiceResponse(true, '', result)
    } catch (error) {
        logger.error(error, {
            function: 'param-other.service.createOrUpdParamOther',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getOptionParamOther = async()=> {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute('MD_PARAMOTHER_Option_AdminWeb')
        return new ServiceResponse(true, '', paramOtherClass.option(res.recordset))
    } catch (error) {
        logger.error(error, {
            function: 'param-other.service.getOptionParamOther',
        });
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getListParamOther,
    getDetailParamOther,
    deleteParamOther,
    createOrUpdParamOther,
    getOptionParamOther
}