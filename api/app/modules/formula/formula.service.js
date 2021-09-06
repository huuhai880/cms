const formulaClass = require('./formula.class');
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
 * Get list FOR_FORMULA
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListFormula = async (queryParams = {}) => {
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
      .execute(PROCEDURE_NAME.FOR_FORMULA_GETLIST_ADMINWEB);
    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: formulaClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { function: 'formulaService.getListFormula' });
    return new ServiceResponse(true, '', {});
  }
};

const deleteFormula = async (formula_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('FORMULAID', formula_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_FORMULA_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'formulaService.deleteFormula',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.FOR_FORMULA_OPTIONS);
};

const createFormulaOrUpdate = async (bodyParams) => {
  try {
    let pool = await mssql.pool;
    let formula_id = apiHelper.getValueFromObject(bodyParams, 'formula_id');
    let formula_name = apiHelper.getValueFromObject(
      bodyParams,
      'formula_name'
    );
    // check formula
    const dataCheckFormulaName = await pool
      .request()
      .input('FORMULAID', formula_id)
      .input('FORMULANAME', formula_name)
      .execute(PROCEDURE_NAME.FOR_FORMULA_CHECK_USERNAME);
    if (
      !dataCheckFormulaName.recordset ||
      dataCheckFormulaName.recordset[0].RESULT
    ) {
      return new ServiceResponse(
        false,
        RESPONSE_MSG.FORMULA.EXISTS_NAME,
        null
      );
    }

    const dataAttributes = await pool
      .request()
      .input('FORMULAID', formula_id)
      .input(
        'ATTRIBUTENAME',
        apiHelper.getValueFromObject(bodyParams, 'formula_name')
      )
      .input(
        'FORMULAGROUPID',
        apiHelper.getValueFromObject(bodyParams, 'attributes_group_id')
      )
      .input(
        'MAINNUMBERID',
        apiHelper.getValueFromObject(bodyParams, 'main_number_id')
      )
      .input(
        'DESCRIPTION',
        apiHelper.getValueFromObject(bodyParams, 'description')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_FORMULA_CREATEDORUPDATE_ADMINWEB);

    const attributeId = dataAttributes.recordset[0].RESULT;

    return new ServiceResponse(true, '', attributeId);
  } catch (e) {
    logger.error(e, {
      function: 'AttributeService.creatAttributeOrUpdate',
    });
    return new ServiceResponse(false);
  }
};

const detailFormula = async (formula_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('FORMULAID', formula_id)
      .execute(PROCEDURE_NAME.FOR_FORMULA_GETBYID_ADMINWEB);
    let datas = data.recordset;
    // If exists partner
    if (datas && datas.length > 0) {
      datas = formulaClass.detail(datas[0]);
      const dataAttributeImage = await pool
        .request()
        .input('FORMULAID', formula_id)
        .execute(PROCEDURE_NAME.FOR_FORMULAIMAGE_GETBYID_ATTRIBUTE_ADMINWEB);
      let dataImage = dataAttributeImage.recordset;
      dataImage = formulaClass.detailAttributeImage(dataImage);
      datas.list_attributes_image = dataImage;
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'formulaService.detailFormula' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListFormula,
  deleteFormula,
  createFormulaOrUpdate,
  detailFormula,
};
