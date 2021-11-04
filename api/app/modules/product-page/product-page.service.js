const ProductPageClass = require('./product-page.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');

const getListProductPage = async () => { // get list product page
  try {

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('MD_PAGE_GetListPage_AdminWeb');
    const result = data.recordset;
    return new ServiceResponse(true, '', {
      data: ProductPageClass.list(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'productPage.getListProductPage',
    });

    return new ServiceResponse(true, '', {});
  }
};

const getListInterPretPageProduct = async (queryParams) => { // get interpret
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input(
        'ATTRIBUTESGROUPID',
        queryParams
      )
      .execute('MD_PRODUCT_PAGE_GetListInterPret_AdminWeb');
    const result = data.recordset;
    return new ServiceResponse(true, '', {
      data: ProductPageClass.list_interpretdetail(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'productPage.getListInterPretPageProduct',
    });

    return new ServiceResponse(true, '', {});
  }
};



module.exports = {
  getListProductPage,
  getListInterPretPageProduct,
 

};
