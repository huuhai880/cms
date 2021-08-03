const planCategoryClass = require('./plan-category.class');
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
const folderName = 'plan-category';
const config = require('../../../config/config');


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
      'function': 'planCategoryService.saveFile',
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

const getListPlanCategory = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.MD_PLAN_CATEGORY_GETLIST_ADMINWEB);

    const planList = data.recordset;
    return new ServiceResponse(true, '', {
      'data': planCategoryClass.list(planList),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(planList),
    });
  } catch (e) {
    logger.error(e, {
      'function': 'PlanCategoryService.getListPlanCategory',
    });
    return new ServiceResponse(true, '', {});
  }
};
const deletePlanCategory = async (id, bodyParams ) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('PLANCATEGORYID',id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_PLAN_CATEGORY_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.PLANCATEGORY.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'planCategoryService.deletePlanCategory'});
    return new ServiceResponse(false, e.message);
  }
};
const getOptionsAll = async (queryParams = {}) => {
  try {
    // Get parameter
    const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
    const pool = await mssql.pool;
    const res = await pool.request()
      .input('ISACTIVE', isActive)
      .execute(PROCEDURE_NAME.MD_PLAN_CATEGORY_GETOPTIONS_ADMINWEB);
    const data = res.recordset;
    return new ServiceResponse(true, '', planCategoryClass.options(data));
  } catch (e) {
    logger.error(e, {'function': 'planCategoryService.getOptionsAll'});

    return new ServiceResponse(true, '', []);
  }
};

const createPlanCategoryOrUpdate = async (bodyParams) => {
  let picture_url = apiHelper.getValueFromObject(bodyParams, 'picture_url');
  if (picture_url) {
    const url = await saveFile(picture_url, folderName);
    if (url) {
      picture_url = url;
    }
  }
  
  try {
    const pool = await mssql.pool;
    const resultCreate = await pool.request()
      .input('PLANCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'plan_category_id'))
      .input('CATEGORYNAME', apiHelper.getValueFromObject(bodyParams, 'category_name'))
      .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_keywords'))
      .execute(PROCEDURE_NAME.MD_PLAN_CATEGORY_CREATEORUPDATE);

    const planCategoryId = resultCreate.recordset[0].RESULT;
    return new ServiceResponse(true,'',planCategoryId);
  } catch (e) {
    logger.error(e, {'function': 'planCategoryService.createPlanCategoryOrUpdate'});
    return new ServiceResponse(false, e.message);
  }
};

const detailPlanCategory = async (id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PLANCATEGORYID', id)
      .execute(PROCEDURE_NAME.MD_PLAN_CATEGORY_GETBYID);

    let planCategory = data.recordset;
    if (planCategory && planCategory.length) {
      planCategory = planCategoryClass.detail(planCategory[0]);
      return new ServiceResponse(true, '', planCategory);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'PlanCategoryService.detailPlanCategory'});

    return new ServiceResponse(false, e.message); 
  }
};

module.exports = {
  getListPlanCategory,
  deletePlanCategory,
  getOptionsAll,
  createPlanCategoryOrUpdate,
  detailPlanCategory
};
