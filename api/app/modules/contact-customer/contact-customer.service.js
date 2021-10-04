const ContactCustomerClass = require('./contact-customer.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const stringHelper = require('../../common/helpers/string.helper');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');

const getListContactCustomer = async (queryParams = {}) => {
  console.log(queryParams)
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
      .input(
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'startDate')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'endDate')
      )
      .input(
        'ISACTIVE',
        apiHelper.getFilterBoolean(queryParams, 'is_active')
      )
      .execute('CRM_CONTACTCUSTOMER_GetList');
    const result = data.recordset;
    return new ServiceResponse(true, '', {
      'data': ContactCustomerClass.list(result),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(result),
    });
  } catch (e) {
    logger.error(e, {
      'function': 'ContactCustomerService.getListContactCustomer',
    });

    return new ServiceResponse(true, '', {});
  }
};

// const createContactCustomer = async (body = {}) => {
//   body.contact_customer_id = null;
//   return await createContactCustomerOrUpdate(body);
// };

// const updateContactCustomer = async (body = {}, contact_customer_id) => {
//   body.contact_customer_id = contact_customer_id;
//   return await createContactCustomerOrUpdate(body);
// };

// const createContactCustomerOrUpdate = async (body = {}) => {
  
//   try {
//     const pool = await mssql.pool;
//     const resultContactCustomer = await pool.request()
//       .input('CONTACTCUSTOMERID', apiHelper.getValueFromObject(body, 'contact_customer_id'))
//       .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name'))
//       .input('NICKNAME', apiHelper.getValueFromObject(body, 'nick_name'))
//       .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
//       .input('KEYCONTACT', apiHelper.getValueFromObject(body, 'key_contact'))
//       .input('CONTENT', apiHelper.getValueFromObject(body, 'content'))
//       .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
//       .execute(PROCEDURE_NAME.CRM_CONTACT_CUSTOMER_CREATEORUPDATE);
//     const contact_customer_id = resultContactCustomer.recordset[0].RESULT;
//     return new ServiceResponse(true, '', contact_customer_id);
//   } catch (error) {
//     logger.error(error, {
//       'function': 'ContactCustomerService.createContactCustomerOrUpdate',
//     });
//     return new ServiceResponse(false, e.message);
//   }
// };


const detailContactCustomer = async (contact_customer_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('CONTACTID', contact_customer_id)
      .execute(PROCEDURE_NAME.CRM_CONTACT_CUSTOMER_GETBYID);

    const contactCustomer = data.recordset[0];
    
    return new ServiceResponse(true, '', ContactCustomerClass.detail(contactCustomer));
  } catch (e) {
    logger.error(e, {
      'function': 'ContactCustomerService.detailContactCustomer',
    });
    return new ServiceResponse(false, e.message);
  }
};

const deleteContactCustomer = async (contact_customer_id, auth_name) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('CONTACTID', contact_customer_id)
      .input('DELETEDUSER', auth_name)
      .execute(PROCEDURE_NAME.CRM_CONTACT_CUSTOMER_DELETE);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      'function': 'ContactCustomerService.deleteContactCustomer',
    });
    return new ServiceResponse(false, e.message);
  }
};


module.exports = {
  getListContactCustomer,
  // createContactCustomer,
  // updateContactCustomer,
  detailContactCustomer,
  deleteContactCustomer,
};
