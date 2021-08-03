const serviceClass = require('./service.class');
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
const folderName = 'service';
const config = require('../../../config/config');


const getListService = async (queryParams = {}) => {

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
      .execute(PROCEDURE_NAME.MD_SERVICE_GETLIST);

    const service = data.recordset;
    return new ServiceResponse(true, '', {
      'data': serviceClass.list(service),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(service),
    });
  } catch (e) {
    logger.error(e, {
      'function': 'serviceService.getListService',
    });

    return new ServiceResponse(true, '', {});
  }
};

const createService = async (body = {}) => {
  body.service_id = null;
  return await createServiceOrUpdate(body);
};

const updateService = async (body = {}, service_id) => {
  body.service_id = service_id;
  return await createServiceOrUpdate(body);
};

const createServiceOrUpdate = async (body = {}) => {
  let image = apiHelper.getValueFromObject(body, 'image');
  if (image) {
    const path_image = await saveFile(image, folderName);
    if (path_image) {
      image = path_image;
    }
  }

  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('SERVICEID', apiHelper.getValueFromObject(body, 'service_id'))
      .input('SERVICENAME', apiHelper.getValueFromObject(body, 'service_name'))
      .input('CONTENT', apiHelper.getValueFromObject(body, 'content'))
      .input('IMAGE', image)
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_SERVICE_CREATEORUPDATE);

    const service_id = data.recordset[0].RESULT;

    return new ServiceResponse(true, '', service_id);
  } catch (error) {
    logger.error(error, {
      'function': 'serviceService.createServiceOrUpdate',
    });
    return new ServiceResponse(false, e.message);
  }
};

const detailService = async (service_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('SERVICEID', service_id)
      .execute(PROCEDURE_NAME.MD_SERVICE_GETBYID);
    const service = data.recordset[0];
    return new ServiceResponse(true, '', serviceClass.detail(service));
  } catch (e) {
    logger.error(e, {
      'function': 'serviceService.detailService',
    });

    return new ServiceResponse(false, e.message);
  }
};

const deleteService = async (service_id, auth_name) => {
  const pool = await mssql.pool;
  try {
    // Delete service
    await pool.request()
      .input('SERVICEID', service_id)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.MD_SERVICE_DELETE);

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      'function': 'serviceService.deleteService',
    });

    // Return failed
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
      'function': 'serviceService.saveFile',
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

module.exports = {
  getListService,
  createService,
  updateService,
  detailService,
  deleteService,
};
