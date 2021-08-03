const httpStatus = require('http-status');
const faqService = require('./faq.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

// Get list faq 
const getListFaq = async (req, res, next) => {
  try {
    const faqRes = await faqService.getListFaq(req.query);
    if(faqRes.isFailed()) {
      return next(faqRes);
    }
    const {data, total, page, limit} = faqRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const getNewestIndex = async (req, res, next)=>{
  try{
    const faqRes = await faqService.getNewestIndex(req.params.type);
    if(faqRes.isFailed()) {
      return next(faqRes);
    }
    return res.json(new SingleResponse(faqRes.getData()))
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
}

// Create faq
const createFaq = async (req, res, next) => {
  try {
    // Insert faq
    const faqRes = await faqService.createFaq(req.body);
    if(faqRes.isFailed()) {
      return next(faqRes);
    }

    return res.json(new SingleResponse(faqRes.getData(), RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Update faq
const updateFaq = async (req, res, next) => {
  try {
    const faq_id = req.params.faq_id;
    // Check faq exists
    const faqResDetail = await faqService.detailFaq(faq_id);
    if(faqResDetail.isFailed()) {
      return next(faqResDetail);
    }
    // Update faq
    const faqRes = await faqService.updateFaq(req.body,faq_id);
    if(faqRes.isFailed()) {
      return next(faqRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Delete faq
const deleteFaq = async (req, res, next) => {
  try {
    const faq_id = req.params.faq_id;
    const auth_name = req.auth.user_name;
    // Check faq exists
    const faqResDetail = await faqService.detailFaq(faq_id);
    if(faqResDetail.isFailed()) {
      return next(faqResDetail);
    }
    // Delete faq
    const faqRes = await faqService.deleteFaq(faq_id,auth_name);
    if(faqRes.isFailed()) {
      return next(faqRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

// Detail faq
const detailFaq = async (req, res, next) => {
  try {
    const faq_id = req.params.faq_id;

    const faqRes = await faqService.detailFaq(faq_id);
    if(faqRes.isFailed()) {
      return next(faqRes);
    }
    return res.json(new SingleResponse(faqRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


module.exports = {
  getListFaq,
  getNewestIndex,
  createFaq,
  updateFaq,
  deleteFaq,
  detailFaq
};
