const attributesGroupClass = require('./attributes-group.class');
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

/**
 * Get list MD_CALCULATION
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListAttributesGroup = async (queryParams = {}) => {
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
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTESGROUP_GETLIST_ADMINWEB);
    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: attributesGroupClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, {
      function: 'attributesGroupService.getListAttributesGroup',
    });
    return new ServiceResponse(true, '', {});
  }
};

const deleteAttributesGroup = async (attributes_group_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('ATTRIBUTESGROUPID', attributes_group_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTESGROUP_DELETE_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'attributesGroupService.deleteCaculation',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.FOR_ATTRIBUTESGROUP_OPTIONS);
};

const createAttributesGroupOrUpdate = async (bodyParams) => {
  try {
    let pool = await mssql.pool;
    let attributes_group_id = apiHelper.getValueFromObject(
      bodyParams,
      'attributes_group_id'
    );
    // check name
    const dataCheckName = await pool
      .request()
      .input('ATTRIBUTESGROUPID', attributes_group_id)
      .input(
        'GROUPNAME',
        apiHelper.getValueFromObject(bodyParams, 'group_name')
      )
     
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTESGROUP_CHECKNAME_ADMINWEB);
    if (!dataCheckName.recordset || dataCheckName.recordset[0].RESULT) {
      return new ServiceResponse(
        false,
        RESPONSE_MSG.ATTRIBUTESGROUP.EXISTS_NAME,
        null
      );
    }
    const data = await pool
      .request()
      .input('ATTRIBUTESGROUPID', attributes_group_id)
      .input(
        'GROUPNAME',
        apiHelper.getValueFromObject(bodyParams, 'group_name')
      )
      .input(
        'ISPOWERDIAGRAM',
        apiHelper.getValueFromObject(bodyParams, 'is_powerditagram')
      )
      .input(
        'ISEMPTYDIAGRAM',
        apiHelper.getValueFromObject(bodyParams, 'is_emptyditagram')
      )
      .input(
        'DESCRIPTION',
        apiHelper.getValueFromObject(bodyParams, 'description')
      )
      .input(
        'INTRODUCTION',
        apiHelper.getValueFromObject(bodyParams, 'instruction')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTESGROUP_CREATEORUPDATE_ADMINWEB);

    const attributesgroupID = data.recordset[0].RESULT;

    return new ServiceResponse(true, '', attributesgroupID);
  } catch (e) {
    logger.error(e, {
      function: 'attributesGroupService.creatCalculationOrUpdate',
    });
    return new ServiceResponse(false);
  }
};

const detailAttributesGroup = async (attributes_group_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('ATTRIBUTESGROUPID', attributes_group_id)
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTESGROUP_GETBYID_ADMINWEB);
    let datas = data.recordset;
    // If exists AttributesGroup
    if (datas && datas.length > 0) {
      datas = attributesGroupClass.detail(datas[0]);
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {
      function: 'attributesGroupService.detailAttributesGroup',
    });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListAttributesGroup,
  deleteAttributesGroup,
  createAttributesGroupOrUpdate,
  detailAttributesGroup,
};
