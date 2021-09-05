const ParamNameClass = require('./param-name.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const fileHelper = require('../../common/helpers/file.helper');
const stringHelper = require('../../common/helpers/string.helper');
const config = require('../../../config/config');

/**
 * Get list MD_PARAMNAME
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListParamName = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input(
        'ISFULLNAME',
        apiHelper.getFilterBoolean(queryParams, 'is_full_name')
      )
      .input(
        'ISLASTNAME',
        apiHelper.getFilterBoolean(queryParams, 'is_last_name')
      )
      .input(
        'ISFIRSTNAME',
        apiHelper.getFilterBoolean(queryParams, 'is_first_name')
      )
      .input(
        'ISFIRSTMIDDLENAME',
        apiHelper.getFilterBoolean(queryParams, 'is_first_middle_name')
      )
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.MD_PARAMNAME_GETLIST_ADMINWEB);
    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: ParamNameClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { function: 'ParamNameService.getListParamName' });
    return new ServiceResponse(true, '', {});
  }
};

const deleteParamName = async (param_name_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('PARAMNAMEID', param_name_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_PARAMNAME_DELETE_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'ParamNameService.deleteParamName',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.MD_PARAMNAME_OPTIONS);
};

const createParamNameOrUpdate = async (bodyParams) => {
  try {
    let pool = await mssql.pool;
    let param_name_id = apiHelper.getValueFromObject(
      bodyParams,
      'param_name_id'
    );

    // check paramname
    const dataCheckParamName = await pool
      .request()
      .input('PARAMNAMEID', param_name_id)
      .input(
        'NAMETYPE',
        apiHelper.getValueFromObject(bodyParams, 'name_type')
      )
      .execute(PROCEDURE_NAME.MD_PARAMNAME_CHECK_PARAMNAME);
    if (
      !dataCheckParamName.recordset ||
      dataCheckParamName.recordset[0].RESULT
    ) {
      return new ServiceResponse(
        false,
        RESPONSE_MSG.PARAMNAME.EXISTS_NAME,
        null
      );
    }

    const dataParamName = await pool
      .request()
      .input('PARAMNAMEID', param_name_id)
      .input(
        'NAMETYPE',
        apiHelper.getValueFromObject(bodyParams, 'name_type')
      )
      .input(
        'ISFULLNAME',
        apiHelper.getValueFromObject(bodyParams, 'is_full_name')
      )
      .input(
        'ISLASTNAME',
        apiHelper.getValueFromObject(bodyParams, 'is_last_name')
      )
      .input(
        'ISFIRSTNAME',
        apiHelper.getValueFromObject(bodyParams, 'is_first_name')
      )
      .input(
        'ISFIRSTMIDDLENAME',
        apiHelper.getValueFromObject(bodyParams, 'is_first_middle_name')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_PARAMNAME_CREATEDORUPDATE_ADMINWEB);

    const attributeId = dataParamName.recordset[0].RESULT;

    return new ServiceResponse(true, '', attributeId);
  } catch (e) {
    logger.error(e, {
      function: 'ParamNameervice.createParamNameOrUpdate',
    });
    return new ServiceResponse(false);
  }
};

const detailParamName = async (param_number_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PARAMNAMEID', param_number_id)
      .execute(PROCEDURE_NAME.MD_PARAMNAME_GETBYID_ADMINWEB);
    let datas = data.recordset;
    // If exists paramname
    if (datas && datas.length > 0) {
      datas = ParamNameClass.detail(datas[0]);
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'ParamNameService.detailParamName' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListParamName,
  deleteParamName,
  createParamNameOrUpdate,
  detailParamName,
};
