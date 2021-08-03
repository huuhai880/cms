const httpStatus = require('http-status');
const ContactCustomerService = require('./contact-customer.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const htmlHelper = require('../../common/helpers/html.helper');
const events = require('../../common/events');
const ValidationResponse = require('../../common/responses/validation.response');
const config = require('../../../config/config');

// Get list ContactCustomer 
const getListContactCustomer = async (req, res, next) => {
  try {
    const serviceRes = await ContactCustomerService.getListContactCustomer(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const {data, total, page, limit} = serviceRes.getData();

    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Create Contact Customer
// const createContactCustomer = async (req, res, next) => {
//   try {
//     // Insert ContactCustomer
//     const serviceRes = await ContactCustomerService.createContactCustomer(req.body);
//     if(serviceRes.isFailed()) {
//       return next(serviceRes);
//     }

//     return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ContactCustomer.CREATE_SUCCESS));
//   } catch (error) {
//     return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//   }
// };

// Update Contact Customer
// const updateContactCustomer = async (req, res, next) => {
//   try {
//     const ContactCustomer_id = req.params.id;
//     const serviceRes = await ContactCustomerService.updateContactCustomer(req.body,ContactCustomer_id);
//     if(serviceRes.isFailed()) {
//       return next(serviceRes);
//     }
//     return res.json(new SingleResponse(null, RESPONSE_MSG.ContactCustomer.UPDATE_SUCCESS));
//   } catch (error) {
//     return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//   }
// };

// Delete Contact Customer
const deleteContactCustomer = async (req, res, next) => {
  try {
    const contact_customer_id = req.params.id;
    const auth_name = req.auth.user_name;
    const serviceRes = await ContactCustomerService.deleteContactCustomer(contact_customer_id, auth_name);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.PLAN.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Detail Contact Customer
const detailContactCustomer = async (req, res, next) => {
  try {
    const contact_customer_id = req.params.id;
    const serviceRes = await ContactCustomerService.detailContactCustomer(contact_customer_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


module.exports = {
  getListContactCustomer,
  // createContactCustomer,
  // updateContactCustomer,
  deleteContactCustomer,
  detailContactCustomer
};
