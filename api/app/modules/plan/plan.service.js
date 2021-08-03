const planClass = require('./plan.class');
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
const folderName = 'plan';
const config = require('../../../config/config');

const getListPlan = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('PLANCATEGORYID', apiHelper.getValueFromObject(queryParams, 'plan_category_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.MD_PLAN_GETLIST);
    
    const plan = data.recordset;
    return new ServiceResponse(true, '', {
      'data': planClass.list(plan),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(plan),
    });
  } catch (e) {
    logger.error(e, {
      'function': 'PlanService.getListPlan',
    });

    return new ServiceResponse(true, '', {});
  }
};

const createPlan = async (body = {}) => {
  body.plan_id = null;
  return await createPlanOrUpdate(body);
};

const updatePlan = async (body = {}, plan_id) => {
  body.plan_id = plan_id;
  return await createPlanOrUpdate(body);
};

const createPlanOrUpdate = async (body = {}) => {
  let image_url = apiHelper.getValueFromObject(body, 'image_url');
  if (image_url) {
    const path_image_url = await saveFile(image_url, folderName);
    if (path_image_url) {
      image_url = path_image_url;
    }
  }
  
  try {
    const pool = await mssql.pool;
    const resultPlan = await pool.request()
      .input('PLANID', apiHelper.getValueFromObject(body, 'plan_id'))
      .input('PLANCATEGORYID', apiHelper.getValueFromObject(body, 'plan_category_id'))
      .input('PLANTITLE', apiHelper.getValueFromObject(body, 'plan_title'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
      .input('IMAGEURL', image_url)
      .input('ATTRIBUTECONTENT', apiHelper.getValueFromObject(body, 'attribute_content'))
      .input('CONTENT', apiHelper.getValueFromObject(body, 'content'))
      .input('SEONAME', apiHelper.getValueFromObject(body, 'seo_name'))
      .input('METAKEYWORDS', apiHelper.getValueFromObject(body, 'meta_keywords'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_PLAN_CREATEORUPDATE);
    const plan_id = resultPlan.recordset[0].RESULT;
    return new ServiceResponse(true, '', plan_id);
  } catch (error) {
    logger.error(error, {
      'function': 'PlanService.createPlanOrUpdate',
    });
    return new ServiceResponse(false, e.message);
  }
};

const saveFile = async (base64, folderName) => {
  let url = null;

  try {
    if (fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      const guid = createGuid();
      url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extension}`);
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      'function': 'PlanService.saveFile',
    });
  }
  return url;
};
const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const detailPlan = async (plan_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PLANID', plan_id)
      .execute(PROCEDURE_NAME.MD_PLAN_GETBYID);

    const plan = data.recordset[0];
    
    return new ServiceResponse(true, '', planClass.detail(plan));
  } catch (e) {
    logger.error(e, {
      'function': 'PlanService.detailPlan',
    });
    return new ServiceResponse(false, e.message);
  }
};

const deletePlan = async (plan_id, auth_name) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('PLANID', plan_id)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.MD_PLAN_DELETE);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      'function': 'PlanService.deletePlan',
    });
    return new ServiceResponse(false, e.message);
  }
};


module.exports = {
  getListPlan,
  createPlan,
  updatePlan,
  detailPlan,
  deletePlan,
};
