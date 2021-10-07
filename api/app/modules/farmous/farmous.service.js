const FarmousClass = require('./farmous.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'famous';
const config = require('../../../config/config');

const getFarmoussList = async (queryParams = {}) => {
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
      .input(
        'ISACTIVE',
        apiHelper.getValueFromObject(queryParams, 'selectdActive')
      )
      .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
      .execute('MD_FARMOUS_GetList_AdminWeb');
    const result = data.recordset;

    return new ServiceResponse(true, '', {
      data: FarmousClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'farmousService.getFarmoussList',
    });

    return new ServiceResponse(true, '', {});
  }
};
const deleteFarmous = async (farmous_id, body) => {
  const pool = await mssql.pool;
  try {
    await pool
      .request()
      .input('FAMOUSID', farmous_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_FARMOUS_Delete_AdminWeb');
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'farmousService.deleteFarmous',
    });
    return new ServiceResponse(false, e.message);
  }
};
/////check farmous
const CheckFarmous = async (farmous_name) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('FAMOUSNAME', farmous_name)
      .execute('MD_FARMOUS_CheckFarmousName_AdminWeb');
    const res = data.recordset[0];
    if (res) {
      return new ServiceResponse(true, '', res);
    }
    return new ServiceResponse(true, '', '');
  } catch (error) {
    return new ServiceResponse(false, error.message);
  }
};
/// add or update farmous
const addFarmous = async (body = {}) => {
  // console.log(body)
  try {
    let image_avatar = apiHelper.getValueFromObject(body, 'image_avatar');

    if (image_avatar) {
      const path_image_avatar = await saveFile(image_avatar, folderName);
      if (path_image_avatar) {
        image_avatar = path_image_avatar;
      }
    }
    const pool = await mssql.pool;
    const resultFarmous = await pool
      .request()
      .input('FAMOUSID', apiHelper.getValueFromObject(body, 'farmous_id'))
      .input('FAMOUSNAME', apiHelper.getValueFromObject(body, 'farmous_name'))
      .input('POSITION', apiHelper.getValueFromObject(body, 'position'))
      .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birthday'))
      .input('ISDEFAULT', apiHelper.getValueFromObject(body, 'is_default'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
      .input('IMAGEAVATAR', image_avatar)

      .input(
        'SHORTDESCRIPTION',
        apiHelper.getValueFromObject(body, 'short_desc')
      )
      .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'desc'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_FARMOUS_CreateOrUpdate_AdminWeb');
    const farmous_id = resultFarmous.recordset[0].RESULT;

    return new ServiceResponse(true, '', farmous_id);
  } catch (error) {
    logger.error(error, {
      function: 'farmousService.addFarmous',
    });
    console.error('farmousService.addFarmous', error);
    return new ServiceResponse(false, e.message);
  }
};
///////detail list farmous
const detailFarmous = async (farmous_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('FAMOUSID', farmous_id)
      .execute('MD_FARMOUS_GetById_AdminWeb');
    const Farmous = data.recordset[0];
    // console.log(Farmous)
    if (Farmous) {
      return new ServiceResponse(true, '', FarmousClass.detail(Farmous));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'farmousService.detailFarmous',
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
      url = await fileHelper.saveBase64(
        folderName,
        base64,
        `${guid}.${extension}`
      );
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      function: 'farmousService.saveFile',
    });
  }
  return url;
};
const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
module.exports = {
  getFarmoussList,
  deleteFarmous,
  addFarmous,
  detailFarmous,
  CheckFarmous,
};
