const customerTypeClass = require('../customer-type/customer-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list CRM_CUSTOMERTYPE
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCustomerType = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input(
        'ISDEFAULT',
        apiHelper.getFilterBoolean(queryParams, 'is_default') || '2'
      )
      .input(
        'ISACTIVE',
        apiHelper.getFilterBoolean(queryParams, 'is_active') || '2'
      )
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_GETLIST_ADMINWEB);

    const customerTypes = data.recordset;
    return new ServiceResponse(true, '', {
      data: customerTypeClass.list(customerTypes),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(customerTypes),
    });
  } catch (e) {
    logger.error(e, { function: 'customerTypeService.getListcustomerType' });

    return new ServiceResponse(true, '', {});
  }
};

const createCustomerTypeOrUpdate = async (body = {}) => {
  const pool = await mssql.pool;
  const dataCheckCustomerTypeName = await pool
    .request()
    .input(
      'CUSTOMERTYPEID',
      apiHelper.getValueFromObject(body, 'customer_type_id')
    )
    .input(
      'CUSTOMERTYPENAME',
      apiHelper.getValueFromObject(body, 'customer_type_name')
    )
    .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_CHECKNAME_ADMINWEB);

  if (
    !dataCheckCustomerTypeName.recordset ||
    dataCheckCustomerTypeName.recordset[0].RESULT
  ) {
      
    return new ServiceResponse(
      false,
      RESPONSE_MSG.CUSTOMERTYPE.EXISTS_NAME,
      null
    );
  }

  try {
    // Save
    const data = await pool
      .request()
      .input(
        'CUSTOMERTYPEID',
        apiHelper.getValueFromObject(body, 'customer_type_id')
      )
      .input(
        'CUSTOMERTYPENAME',
        apiHelper.getValueFromObject(body, 'customer_type_name')
      )
      .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(body, 'order_index'))
      .input('ISDEFAULT', apiHelper.getValueFromObject(body, 'is_default'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_CREATEORUPDATE_ADMINWEB);
    removeCacheOptions();
    return new ServiceResponse(true, '', data.recordset[0].RESULT);
  } catch (error) {
    logger.error(error, {
      customerType: 'customerTypeService.createCustomerTypeOrUpdate',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_CUSTOMERTYPE_OPTIONS);
};

const detailCustomerType = async (customer_type_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('CUSTOMERTYPEID', customer_type_id)
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_GETBYID_ADMINWEB);
    const customerType = data.recordset[0];
    if (customerType) {
      return new ServiceResponse(
        true,
        '',
        customerTypeClass.detail(customerType)
      );
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, { function: 'customerTypeService.detailcustomerType' });

    return new ServiceResponse(false, e.message);
  }
};

const deleteCustomerType = async (customer_type_id, bodyParams) => {
  const pool = await mssql.pool;
  try {
    // Delete user group
    await pool
      .request()
      .input('CUSTOMERTYPEID', customer_type_id)
      .input(
        'UPDATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_DELETE_ADMINWEB);

    removeCacheOptions();

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, { function: 'customerTypeService.deletecustomerType' });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListCustomerType,
  createCustomerTypeOrUpdate,
  detailCustomerType,
  deleteCustomerType,
};
