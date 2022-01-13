const discountClass = require('./discount.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');


const getOptions = async () => {
  try {
    const pool = await mssql.pool;
    const req = await pool.request()
      .execute(PROCEDURE_NAME.PRO_DISCOUNT_GETOPTION_ADMINWEB);
    const resProduct = discountClass.optionsProduct(req.recordsets[0])
    const resCustomer = discountClass.optionsCustomer(req.recordsets[1])
    return new ServiceResponse(true, "", {
      resProduct,
      resCustomer
    });
  } catch (e) {
    logger.error(e, { 'function': 'DepartmentService.deleteDepartment' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getOptions
};
