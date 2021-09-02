const attributesClass = require('./attributes.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const fileHelper = require('../../common/helpers/file.helper');
const stringHelper = require('../../common/helpers/string.helper');
const config = require('../../../config/config');

/**
 * Get list FOR_ATTRIBUTES
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListAttributes = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input(
        'ATTRIBUTESGROUPID',
        apiHelper.getValueFromObject(queryParams, 'attributes_group_id')
      )
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTES_GETLIST_ADMINWEB);
    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: attributesClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { function: 'attributesService.getListAttributes' });
    return new ServiceResponse(true, '', {});
  }
};

const deleteAttributes = async (attribute_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('ATTRIBUTEID', attribute_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTES_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'attributesService.deleteAttributes',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.FOR_ATTRIBUTES_OPTIONS);
};

const createAttributesOrUpdate = async (bodyParams) => {
  try {
    let pool = await mssql.pool;
    let attribute_id = apiHelper.getValueFromObject(bodyParams, 'attribute_id');
    let list_attributes_image = apiHelper.getValueFromObject(
      bodyParams,
      'list_attributes_image'
    );
    let attribute_name = apiHelper.getValueFromObject(
      bodyParams,
      'attribute_name'
    );
    let attributes_group_name = apiHelper.getValueFromObject(
      bodyParams,
      'attributes_group_name'
    );
    // check mainnumber
    const dataCheckAttributenName = await pool
      .request()
      .input('ATTRIBUTEID', attribute_id)
      .input('ATTRIBUTENAME', attribute_name)
      .input(
        'ATTRIBUTESGROUPID',
        apiHelper.getValueFromObject(bodyParams, 'attributes_group_id')
      )
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTES_CHECK_USERNAME);
    if (
      !dataCheckAttributenName.recordset ||
      dataCheckAttributenName.recordset[0].RESULT
    ) {
      return new ServiceResponse(
        false,
        `Nhóm thuộc tính ${attributes_group_name} đã tồn tại tên thuộc tính ${attribute_name}.`,
        null
      );
    }

    const dataAttributes = await pool
      .request()
      .input('ATTRIBUTEID', attribute_id)
      .input(
        'ATTRIBUTENAME',
        apiHelper.getValueFromObject(bodyParams, 'attribute_name')
      )
      .input(
        'ATTRIBUTESGROUPID',
        apiHelper.getValueFromObject(bodyParams, 'attributes_group_id')
      )
      .input(
        'MAINNUMBERID',
        apiHelper.getValueFromObject(bodyParams, 'main_number_id')
      )
      .input(
        'DESCRIPTION',
        apiHelper.getValueFromObject(bodyParams, 'description')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTES_CREATEDORUPDATE_ADMINWEB);

    const attributeId = dataAttributes.recordset[0].RESULT;

    if (attribute_id) {
      const delAttributes = await pool
        .request()
        .input('ATTRIBUTEID', attribute_id)
        .input(
          'DELETEDUSER',
          apiHelper.getValueFromObject(bodyParams, 'auth_name')
        )
        .execute(PROCEDURE_NAME.FOR_ATTRIBUTESIMAGE_DELETE);
    }

    if (list_attributes_image && list_attributes_image.length > 0) {
      for (let i = 0; i < list_attributes_image.length; i++) {
        let item = list_attributes_image[i];
        let url_images = apiHelper.getValueFromObject(item, 'url_images');
        if (url_images) {
          let path_url_images = await saveFile(url_images, 'attributes');
          if (path_url_images) {
            url_images = path_url_images;
          }
        }
        const dataAttributesImage = await pool
          .request()
          .input('ATTRIBUTEID', attributeId)
          .input('IMGESID', apiHelper.getValueFromObject(item, 'imges_id'))
          .input('PARTNERID', apiHelper.getValueFromObject(item, 'partner_id'))
          .input('URLIMAGES', url_images)
          .input('ISDEFAULT', apiHelper.getValueFromObject(item, 'is_default'))
          .input(
            'ISACTIVE',
            apiHelper.getValueFromObject(item, 'is_active_image')
          )
          .input('CREATEDUSER', apiHelper.getValueFromObject(item, 'auth_name'))
          .execute(PROCEDURE_NAME.FOR_ATTRIBUTESIMAGE_CREATEDORUPDATE_ADMINWEB);

        const attributeImageId = dataAttributesImage.recordset[0].RESULT;
        if (attributeImageId <= 0) {
          return new ServiceResponse(
            false,
            RESPONSE_MSG.ATTRIBUTES.CREATE_FAILED
          );
        }
      }
    }
    return new ServiceResponse(true, '', attributeId);
  } catch (e) {
    logger.error(e, {
      function: 'AttributeService.creatAttributeOrUpdate',
    });
    return new ServiceResponse(false);
  }
};

const detailAttributes = async (attribute_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('ATTRIBUTEID', attribute_id)
      .execute(PROCEDURE_NAME.FOR_ATTRIBUTES_GETBYID_ADMINWEB);
    let datas = data.recordset;
    // If exists partner
    if (datas && datas.length > 0) {
      datas = attributesClass.detail(datas[0]);
      const dataAttributeImage = await pool
        .request()
        .input('ATTRIBUTEID', attribute_id)
        .execute(PROCEDURE_NAME.FOR_ATTRIBUTESIMAGE_GETBYID_ATTRIBUTE_ADMINWEB);
      let dataImage = dataAttributeImage.recordset;
      dataImage = attributesClass.detailAttributeImage(dataImage);
      datas.list_attributes_image = dataImage;
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'attributesService.detailAttributes' });
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
      function: 'attributesService.saveFile',
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
  getListAttributes,
  deleteAttributes,
  createAttributesOrUpdate,
  detailAttributes,
};
