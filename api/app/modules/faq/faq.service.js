const faqClass = require('./faq.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const getListFaq = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('FAQSTYPE', apiHelper.getValueFromObject(queryParams, 'faq_type'))
      .execute(PROCEDURE_NAME.CMS_FAQS_GETLIST);

    const faq = data.recordset;
    return new ServiceResponse(true, '', {
      'data': faqClass.list(faq),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(faq),
    });
  } catch (e) {
    logger.error(e, {
      'function': 'faqService.getListFaq',
    });

    return new ServiceResponse(true, '', {});
  }
};

const getNewestIndex = async (type)=>{
  try{
    const pool = await mssql.pool;
    const {recordset} = await pool.request().input("FAQSTYPE", type)
    .execute(PROCEDURE_NAME.CMS_FAQS_GETNEWESTINDEX);
    return new ServiceResponse(true, '', {order_index: recordset[0]['ORDERINDEX']})
  } catch (e) {
    logger.error(e, {
      'function': 'faqService.getListFaq',
    });
  }
}

const createFaq = async (body = {}) => {
  body.faq_id = null;
  return await createFaqOrUpdate(body);
};

const updateFaq = async (body = {}, faq_id) => {
  body.faq_id = faq_id;
  return await createFaqOrUpdate(body);
};

const createFaqOrUpdate = async (body = {}) => {

  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('FAQSID', apiHelper.getValueFromObject(body, 'faq_id'))
      .input('QUESTION', apiHelper.getValueFromObject(body, 'question'))
      .input('ANSWER', apiHelper.getValueFromObject(body, 'answer'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(body, 'order_index'))
      .input('FAQSTYPE', apiHelper.getValueFromObject(body, 'faq_type'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_FAQS_CREATEORUPDATE);

    const faq_id = data.recordset[0].RESULT;
    removeCacheOptions(`${CACHE_CONST.CMS_FAQS}-${apiHelper.getValueFromObject(body, 'faq_type')}`);

    return new ServiceResponse(true, '', faq_id);
  } catch (error) {
    logger.error(error, {
      'function': 'faqService.createFaqOrUpdate',
    });
    return new ServiceResponse(false, e.message);
  }
};

const detailFaq = async (faq_id) => {  
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('FAQSID', faq_id)
      .execute(PROCEDURE_NAME.CMS_FAQS_GETBYID);
    const faq = data.recordset[0];
    return new ServiceResponse(true, '', faqClass.detail(faq));
  } catch (e) {
    logger.error(e, {
      'function': 'faqService.detailFaq',
    });

    return new ServiceResponse(false, e.message);
  }
};

const deleteFaq = async (faq_id, auth_name) => {
  const pool = await mssql.pool;
  try {
    // Delete faq
    await pool.request()
      .input('FAQSID', faq_id)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.CMS_FAQS_DELETE);
    removeCacheOptions(`${CACHE_CONST.CMS_FAQS}-1`);
    removeCacheOptions(`${CACHE_CONST.CMS_FAQS}-2`);
    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      'function': 'faqService.deleteFaq',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = (CACHE_KEY) => {
  return cacheHelper.removeByKey(CACHE_KEY);
};


module.exports = {
  getListFaq,
  getNewestIndex,
  createFaq,
  updateFaq,
  detailFaq,
  deleteFaq
}
