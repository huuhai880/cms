const IngredientClass = require('./formula-ingredients.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
///////get listInterpret
const getIngredient = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input(
        'ISACTIVE',
        apiHelper.getFilterBoolean(queryParams, 'selectdActive')
      )
      .execute('FOR_FORMULAINGREDIENTS_GetList_AdminWeb');
    const result = data.recordset;
    // console.log(apiHelper.getTotalData(result));

    return new ServiceResponse(true, '', {
      data: IngredientClass.listIngredients(result),
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.getInterpretsList',
    });

    return new ServiceResponse(true, '', {});
  }
};

module.exports = {
    getIngredient,
};
