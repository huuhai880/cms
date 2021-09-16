const OrderClass = require('./order.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

///////get  OrderClass
const getOrderList = async (queryParams = {}) => {
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
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'startDate')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'endDate')
      )
      .input('STATUS', apiHelper.getFilterBoolean(queryParams, 'selectdActive'))
      .execute('SL_ORDER_GetList_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: OrderClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'OrderService.getOrderList',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////detail order
const detailOrder = async (order_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('ORDERID', order_id)
      .execute('SL_ORDER_GetbyId_AdminWeb');
    const result = data.recordset[0];
    // console.log(Account)
    if (result) {
      return new ServiceResponse(true, '', OrderClass.detailOrder(result));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'OrderService.detailOrder',
    });

    return new ServiceResponse(false, e.message);
  }
};
const getListProduct = async (order_id) => {
  // console.log(order_id);
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('ORDERID', order_id)
      .execute('SL_ORDER_GetListProductbyId_AdminWeb');
    //   console.log(queryParams);
    const result = data.recordset;

    return new ServiceResponse(true, '', {
      data: OrderClass.listProduct(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'OrderService.getListProduct',
    });

    return new ServiceResponse(true, '', {});
  }
};
module.exports = {
  getOrderList,
  detailOrder,
  getListProduct,
};
