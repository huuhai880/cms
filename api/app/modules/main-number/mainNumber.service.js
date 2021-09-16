const MainNumberClass = require('./mainNumber.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const stringHelper = require('../../common/helpers/string.helper');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'mainNumber';
const config = require('../../../config/config');
///////get list main partner
const getPartnersList = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_MAINNUMBER_GetPartner_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: MainNumberClass.partnerList(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'MainNumberService.getMainNumberList',
    });

    return new ServiceResponse(true, '', {});
  }
};
/////check main number
const CheckMainNumber = async (main_number) => {
  // console.log(main_number)
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('MAINNUMBER', main_number)
      .execute('FOR_MAINNUMBER_CheckMainNumber_AdminWeb');
    const res = data.recordset[0];
    if (res) {
      return new ServiceResponse(true, '', res);
    }
    return new ServiceResponse(true, '', '');
  } catch (error) {
    return new ServiceResponse(false, error.message);
  }
};
///////get list main number
const getMainNumberList = async (queryParams = {}) => {
  console.log(queryParams)
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    // console.log(queryParams )
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('PARTNERID', apiHelper.getValueFromObject(queryParams, 'partner_id'))
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
        apiHelper.getFilterBoolean(queryParams, 'selectdActive')
      )
      .execute('FOR_MAINNUMBER_GetList_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: MainNumberClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'MainNumberService.getMainNumberList',
    });

    return new ServiceResponse(true, '', {});
  }
};
const getImageListByNum = async (mainNumber_id) => {
  // console.log(queryParams);
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('MAINNUMBERID', mainNumber_id)
      .execute('FOR_MAINNUMBERIMAGE_GetListByNumberId_AdminWeb');
    //   console.log(queryParams);
    const result = data.recordset;

    return new ServiceResponse(true, '', {
      data: MainNumberClass.imgList(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'MainNumberService.getImageListByNum',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////detail list main number
const detailMainNumber = async (memberid) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('MAINNUMBERID', memberid)
      .execute('FOR_MAINNUMBER_GetById_AdminWeb');
    const MainNumber = data.recordset[0];
    // console.log(Account)
    if (MainNumber) {
      return new ServiceResponse(true, '', MainNumberClass.detail(MainNumber));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'MainNumberService.detailMainNumber',
    });

    return new ServiceResponse(false, e.message);
  }
};
///////delete list main number
const deleteMainNumber = async (mainNumber_id, body) => {
  const pool = await mssql.pool;
  try {
    await pool
      .request()
      .input('MAINNUMBERID', mainNumber_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('FOR_MAINNUMBER_Delete_AdminWeb');
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'MainNumberService.deleteMainNumber',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
const addMainNumber = async (body = {}) => {
  // console.log(body);

  // console.log(body)
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();

    /////create or update number
    const requestMainNumber = new sql.Request(transaction);
    const resultMainNumber = await requestMainNumber
      .input(
        'MAINNUMBERID',
        apiHelper.getValueFromObject(body, 'main_number_id')
      )
      .input('MAINNUMBER', apiHelper.getValueFromObject(body, 'main_number'))

      .input(
        'DESCRIPTION',
        apiHelper.getValueFromObject(body, 'main_number_desc')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('FOR_MAINNUMBER_CreateOrUpdate_AdminWeb');
    const mainNumber_id = resultMainNumber.recordset[0].RESULT;
    // console.log(apiHelper.getValueFromObject(body, 'main_number_id'))
    if (apiHelper.getValueFromObject(body, 'main_number_id')) {
      await pool
        .request()
        .input('MAINNUMBERID', mainNumber_id)
        .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
        .execute('FOR_MAINNUMBERIMAGE_DeleteByNumberId_AdminWeb');
    }
    if (mainNumber_id > 0) {
      for (let index = 0; index < body.main_number_img.length; index++) {
        const element = body.main_number_img[index];
        let image_avatar = apiHelper.getValueFromObject(
          element,
          'main_number_images_url'
        );
        if (image_avatar) {
          const path_image_avatar = await saveFile(image_avatar, folderName);
          if (path_image_avatar) {
            image_avatar = path_image_avatar;
          }
        }
        const requestMainNumberImg = new sql.Request(transaction);
        await requestMainNumberImg
          .input('MAINNUMBERID', mainNumber_id)
          .input(
            'PARTNERID',
            apiHelper.getValueFromObject(element, 'partner_id')
          )
          .input('URLIMAGES', image_avatar)
          .input(
            'PARTNERID',
            apiHelper.getValueFromObject(element, 'partner_id')
          )
          .input(
            'ISACTIVE',
            apiHelper.getValueFromObject(element, 'img_is_active')
          )
          .input(
            'ISDEFAULT',
            apiHelper.getValueFromObject(element, 'img_is_default')
          )
          .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
          .execute('FOR_MAINNUMBERIMAGE_Create_AdminWeb');
      }
    } else {
      await transaction.rollback();
    }
    await transaction.commit();
    return new ServiceResponse(true, '', mainNumber_id);
  } catch (error) {
    logger.error(error, {
      function: 'MainNumberService.addMainNumber',
    });
    console.error('AccountService.createCRMAccountOrUpdate', error);
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
      function: 'AccountService.saveFile',
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
  getMainNumberList,
  deleteMainNumber,
  detailMainNumber,
  getImageListByNum,
  getPartnersList,
  CheckMainNumber,
  addMainNumber,
};
