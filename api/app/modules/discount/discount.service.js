const discountClass = require('./discount.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
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
    logger.error(e, { 'function': 'discountService.getOption' });
    return new ServiceResponse(false, e.message);
  }
};

const createOrUpdateDiscount = async (body = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    // check mã code đã tồn tại hay chưa
    const res=   await pool.request()
      .input('DISCOUNTID', apiHelper.getValueFromObject(body, 'discount_id'))
      .input('DISCOUNTCODE', apiHelper.getValueFromObject(body, 'discount_code'))
      .execute(PROCEDURE_NAME.PRO_DISCOUNT_CHECKDISCOUNT_ADMINWEB);
    if(res.recordset[0].RESULT == 1){
      await transaction.rollback();
      return new ServiceResponse(false, 'Code khuyễn mãi đã tồn tại.');
    }
    const requestDiscount = new sql.Request(transaction);
    const resultDiscount = await requestDiscount
      .input('DISCOUNTID', apiHelper.getValueFromObject(body, 'discount_id'))
      .input('DISCOUNTCODE', apiHelper.getValueFromObject(body, 'discount_code'))
      .input('ISPERCENTDISCOUNT', apiHelper.getValueFromObject(body, 'is_percent_discount'))
      .input('ISMONEYDISCOUNT', apiHelper.getValueFromObject(body, 'is_money_discount'))
      .input('DISCOUNTVALUE', apiHelper.getValueFromObject(body, 'discount_value'))
      .input('ISALLPRODUCT', apiHelper.getValueFromObject(body, 'is_all_product'))
      .input('ISAPPOINTPRODUCT', apiHelper.getValueFromObject(body, 'is_appoint_product'))
      .input('ISALLCUSTOMERTYPE', apiHelper.getValueFromObject(body, 'is_all_customer_type'))
      .input('ISAPPOINTCUSTOMERTYPE', apiHelper.getValueFromObject(body, 'is_app_point_customer_type'))
      .input('ISAPPLYOTHERDISCOUNT', apiHelper.getValueFromObject(body, 'is_apply_orther_discount'))
      .input('ISNONEREQUIREMENT', apiHelper.getValueFromObject(body, 'is_none_requirement'))
      .input('ISMINTOTALMONEY', apiHelper.getValueFromObject(body, 'is_mintotal_money'))
      .input('VALUEMINTOTALMONEY', apiHelper.getValueFromObject(body, 'value_mintotal_money'))
      .input('ISMINNUMPRODUCT', apiHelper.getValueFromObject(body, 'is_min_product'))
      .input('VALUEMINNUMPRODUCT', apiHelper.getValueFromObject(body, 'is_value_min_product'))
      .input('NOTE', apiHelper.getValueFromObject(body, 'description'))
      .input('STARTDATE', apiHelper.getValueFromObject(body, 'start_date'))
      .input('ENDDATE', apiHelper.getValueFromObject(body, 'end_date'))
      .input('DISCOUNTSTATUS', apiHelper.getValueFromObject(body, 'discount_status'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.PRO_DISCOUNT_CREATEORUPDATE_ADMINWEB);
    const discount_id = resultDiscount.recordset[0].RESULT;
    if (discount_id <= 0) {
      await transaction.rollback();
      return new ServiceResponse(false, 'Lỗi khởi tạo mã khuyến mãi');
    }

    const product_list = apiHelper.getValueFromObject(body, 'product_list');
    const customer_type_list = apiHelper.getValueFromObject(body, 'customer_type_list');

    // delete sản phẩm theo mã khuyễn mãi
    
    await pool.request()
      .input('DISCOUNTID', discount_id)
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.PRO_DISCOUNT_PRODUCT_DELETE_ADMINWEB);
    // delete loại khách hàng ap dung khuyến mãi
    await pool.request()
      .input('DISCOUNTID', discount_id)
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.PRO_DISCOUNT_CUSTOMERTYPE_DELETE_ADMINWEB);

    if (product_list && product_list.length) {
      const requestDiscountProduct = new sql.Request(transaction);
      for (let i = 0; i < product_list.length; i++) {
        let item = product_list[i]
        const resuestDiscountProduct = await requestDiscountProduct
          .input('DISCOUNTID', discount_id)
          .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
          .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
          .execute(PROCEDURE_NAME.PRO_DISCOUNT_PRODUCT_CREATEORUPDATE_ADMINWEB);
        const discount_product_id = resuestDiscountProduct.recordset[0].RESULT;
        if (discount_product_id <= 0) {
          await transaction.rollback();
          return new ServiceResponse(false, 'Lỗi khởi tạo sản phẩm áp dụng mã khuyễn mãi.');
        }
      }
    }

    if (customer_type_list && customer_type_list.length) {
      const requestDcCutomerType = new sql.Request(transaction);
      for (let i = 0; i < customer_type_list.length; i++) {
        let item = customer_type_list[i]
        const resuestDcCutomerType = await requestDcCutomerType
          .input('DISCOUNTID',discount_id)
          .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(item, 'customer_type_id'))
          .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
          .execute(PROCEDURE_NAME.PRO_DISCOUNT_CUSTOMERTYPE_CREATEORUPDATE_ADMINWEB);
        const discount_customer_id = resuestDcCutomerType.recordset[0].RESULT;
        if (discount_customer_id <= 0) {
          await transaction.rollback();
          return new ServiceResponse(false, 'Lỗi khởi tạo khách hàng áp dụng khuyến mãi.');
        }
      }
    }

    await transaction.commit();
    return new ServiceResponse(true, '', discount_id);
  } catch (error) {
    await transaction.rollback();
    logger.error(error, {
      function: 'discountService.createOrUpdateDiscount',
    });
    console.error('discountService.createOrUpdateDiscount', error);
    return new ServiceResponse(false, error.message);
  }
};

const getListDiscount = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input('CREATEDDATEFROM',apiHelper.getValueFromObject(queryParams, 'start_date'))
      .input('CREATEDDATETO',apiHelper.getValueFromObject(queryParams, 'end_date'))
      .input('DISCOUNTSTATUS',apiHelper.getValueFromObject(queryParams, 'discount_status'))
      .input('ISACTIVE',apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('ISDELETED',apiHelper.getFilterBoolean(queryParams, 'is_delete'))
      .execute(PROCEDURE_NAME.PRO_DISCOUNT_GETLIST_AdminWeb);
    const result = data.recordset;
  

    return new ServiceResponse(true, '', {
      data: discountClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'letterService.getLettersList',
    });

    return new ServiceResponse(true, '', {});
  }
};


module.exports = {
  getOptions,
  createOrUpdateDiscount,
  getListDiscount
};
