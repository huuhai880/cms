/* eslint-disable no-await-in-loop */
const productClass = require('../product/product.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const folderName = 'productpicture';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const { saveImage } = require('../../common/helpers/saveFile.helper');

const savedPath = 'product_image';


const getListProduct = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const resProduct = await pool
      .request()
      .input('keyword', keyword)
      .input('productcategoryid', apiHelper.getValueFromObject(queryParams, 'product_category_id', null))
      .input('startdate', apiHelper.getValueFromObject(queryParams, 'start_date', null))
      .input('enddate', apiHelper.getValueFromObject(queryParams, 'end_date', null))
      .input('isactive', apiHelper.getValueFromObject(queryParams, 'is_active', 2))
      .input('pagesize', itemsPerPage)
      .input('pageindex', currentPage)
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETLIST_ADMINWEB);

    let list = productClass.list(resProduct.recordset);
    let total = apiHelper.getTotalData(resProduct.recordset);
    return new ServiceResponse(true, "", { list, total })
  } catch (e) {
    logger.error(e, {
      function: 'product.service.getListProduct',
    });
    return new ServiceResponse(false, e.message);
  }
};



const createProductOrUpdate = async (body = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    const dataCheck = await pool
      .request()
      .input(
        'PRODUCTID',
        parseInt(apiHelper.getValueFromObject(body, 'product_id'))
      )
      .input('PRODUCTCODE', apiHelper.getValueFromObject(body, 'product_code'))
      .execute(PROCEDURE_NAME.MD_PRODUCT_CHECKNAME);
    if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
      // used
      return new ServiceResponse(
        false,
        RESPONSE_MSG.PRODUCT.CHECK_CODE_FAILED,
        null
      );
    }

    // Begin transaction
    await transaction.begin();
    // Save Product
    const requestProduct = new sql.Request(transaction);
    const resultProduct = await requestProduct
      .input('PRODUCTID', apiHelper.getValueFromObject(body, 'product_id'))
      .input(
        'PRODUCTCATEGORYID',
        apiHelper.getValueFromObject(body, 'product_category_id')
      )
      .input('AUTHORID', apiHelper.getValueFromObject(body, 'author_id'))
      .input(
        'PUBLISINGCOMPANYID',
        apiHelper.getValueFromObject(body, 'publishing_company_id')
      )
      .input('RELEASETIME', apiHelper.getValueFromObject(body, 'release_time'))
      .input('PRODUCTCODE', apiHelper.getValueFromObject(body, 'product_code'))
      .input('PRODUCTNAME', apiHelper.getValueFromObject(body, 'product_name'))
      .input(
        'PRODUCTNAMESHOWWEB',
        apiHelper.getValueFromObject(body, 'product_name_show_web')
      )
      .input(
        'PRODUCTCONTENTDETAIL',
        apiHelper.getValueFromObject(body, 'product_content_detail')
      )
      .input(
        'SHORTDESCRIPTION',
        apiHelper.getValueFromObject(body, 'short_description')
      )
      .input('VIDEOURL', apiHelper.getValueFromObject(body, 'video_url'))
      .input('ISSHOWHOME', apiHelper.getValueFromObject(body, 'is_show_home'))
      .input('ISSHOWWEB', apiHelper.getValueFromObject(body, 'is_show_web'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .input(
        'PUBLISHINGCOMPANY',
        apiHelper.getValueFromObject(body, 'publishing_company')
      )
      .execute(PROCEDURE_NAME.MD_PRODUCT_CREATEORUPDATE);

    const selectedValues = body.product_attribute_values
      .map((e) => ({
        ...e.attribute_values.find((item) => item.value == e.selected),
        selected: e.selected,
      }))
      .filter((e) => !RegExp(/^s_/gm).test(e.selected) && e.selected);
    let product_id = apiHelper.getValueFromObject(body, 'product_id') || '';
    if (
      resultProduct &&
      resultProduct.recordset &&
      resultProduct.recordset.length
    ) {
      product_id = Object.values(resultProduct.recordset[0])[0];
    }

    if (product_id) {
      for (let i = 0; i < selectedValues.length; i++) {
        try {
          const requestQuery = new sql.Request(transaction);
          const data = await requestQuery
            .input('PRODUCTID', product_id)
            .input(
              'PRODUCTATTRIBUTEID',
              parseInt(selectedValues[i].porduct_attribute_id)
            )
            .input('ATTRIBUTEVALUES', selectedValues[i].attribute_value)
            .input(
              'CREATEDUSER',
              apiHelper.getValueFromObject(body, 'auth_name')
            )
            .execute(PROCEDURE_NAME.PRO_PRODUCTATTRIBUTEVALUES_CREATE);
        } catch (e) {
          await transaction.rollback();
          logger.error(error, {
            function: 'ProductService.createProductAttributeValues',
          });
        }
      }
    }

    const deletedAttributeValues = body.deleted_attributes;
    if (deletedAttributeValues && deletedAttributeValues.length) {
      for (let i = 0; i < deletedAttributeValues.length; i++) {
        try {
          const requestQuery = new sql.Request(transaction);
          data = await requestQuery
            .input('PRODUCTATTRIBUTEVALUESID', deletedAttributeValues[i])
            .input(
              'UPDATEDUSER',
              apiHelper.getValueFromObject(body, 'auth_name')
            )
            .execute('PRO_PRODUCTATTRIBUTEVALUES_DeleteByID');
        } catch (e) {
          logger.error(error, {
            function: 'ProductService.deleteAttributeValues',
          });
        }
      }
    }

    const { newImages, updateImages, deleteImages } = body;
    //create new image
    for (let i = 0; i < newImages.length; i++) {
      const requestQuery = new sql.Request(transaction);
      const picture_url = await saveImage(savedPath, newImages[i].picture_url);
      data = await requestQuery
        .input('PICTUREURL', picture_url)
        .input('PRODUCTID', product_id)
        .input('ISDEFAULT', newImages[i].is_default)
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
        .execute('PRO_PRODUCTIMAGES_CreateOrUpdate');
    }

    //update new image
    for (let i = 0; i < updateImages.length; i++) {
      const requestQuery = new sql.Request(transaction);
      data = await requestQuery
        .input('PRODUCTIMAGEID', updateImages[i].product_picture_id)
        .input('ISDEFAULT', updateImages[i].is_default)
        .execute('PRO_PRODUCTIMAGES_CreateOrUpdate');
    }

    //delete new image
    for (let i = 0; i < deleteImages.length; i++) {
      const requestQuery = new sql.Request(transaction);
      data = await requestQuery
        .input('PRODUCTPICTUREID', deleteImages[i].product_picture_id)
        .execute('PRO_PRODUCTPICTURE_Delete');
    }

    transaction.commit();
    removeCacheOptions();
    return new ServiceResponse(true, '', { product_id });
  } catch (error) {
    await transaction.rollback();
    logger.error(error, {
      function: 'ProductService.createProductOrUpdate',
    });
    console.error('ProductService.createProductOrUpdate', error);
    // Return error
    return new ServiceResponse(false, e.message);
  }
};

const detailProduct = async (product_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('PRODUCTID', product_id)
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETBYID);
    if (data.recordsets && data.recordsets.length > 0) {
      if (data.recordsets[0].length > 0) {
        const products = data.recordsets[0];
        const values = data.recordsets[2];
        let record = productClass.detail(products[0]);
        record.product_attribute_values =
          productClass.proAttributeValues(values);
        return new ServiceResponse(true, '', record);
      }
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {
      function: 'ProductService.detailProduct',
    });

    return new ServiceResponse(false, e.message);
  }
};

const changeStatusProduct = async (product_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('PRODUCTID', product_id)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'UPDATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_PRODUCT_UPDATESTATUS);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'ProductService.changeStatusProduct',
    });
    return new ServiceResponse(false);
  }
};

const deleteProduct = async (product_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('PRODUCTID', product_id)
      .input(
        'UPDATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_PRODUCT_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'ProductService.deleteProduct',
    });
    return new ServiceResponse(false, e.message);
  }
};
const getOptions = async function (queryParams) {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input(
        'PRODUCTCATEGORYID',
        apiHelper.getValueFromObject(queryParams, 'product_category_id')
      )
      .input(
        'MANUFACTURERID',
        apiHelper.getValueFromObject(queryParams, 'manufacturer_id')
      )
      .input('ORIGINID', apiHelper.getValueFromObject(queryParams, 'origin_id'))
      .input(
        'ISSHOWWEB',
        apiHelper.getFilterBoolean(queryParams, 'is_show_web')
      )
      .input('ISSERVICE', apiHelper.getFilterBoolean(queryParams, 'is_service'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('IDS', apiHelper.getValueFromObject(queryParams, 'ids'))
      .input('AUTHORID', apiHelper.getValueFromObject(queryParams, 'author_id'))
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETOPTIONS);

    return new ServiceResponse(true, '', productClass.options(data.recordset));
  } catch (e) {
    logger.error(e, {
      function: 'ProductService.getOptions',
    });
    return new ServiceResponse(false, e.message);
  }
};
const savePicture = async (base64, filename) => {
  let url = null;
  try {
    if (fileHelper.isBase64(base64)) {
      const extentions = ['.jpeg', '.jpg', '.png', '.gif'];
      const extention = fileHelper.getExtensionFromFileName(
        filename,
        extentions
      );
      if (extention) {
        const guid = createGuid();
        url = await fileHelper.saveBase64(
          folderName,
          base64,
          `${guid}.${extention}`
        );
      }
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      function: 'ProductService.savePicture',
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
const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.MD_PRODUCT_OPTIONS);
};

const getOrderNumber = async () => {
  try {
    const pool = await mssql.pool;
    const { recordset } = await pool
      .request()
      .execute('MD_PRODUCT_GetOrderNumber');
    if (recordset && recordset.length) {
      const data = recordset[0]['RESULT'];
      const fourDigit = (value) => {
        if (value.length === 4) return value;
        return fourDigit('0' + value);
      };
      const result = fourDigit(parseInt(data) + 1);
      return new ServiceResponse(true, '', result);
    }
    return new ServiceResponse(false, 'Thất bại');
  } catch (error) {
    logger.error(e, {
      function: 'ProductService.getOrderNumber',
    });
    return new ServiceResponse(false, e.message);
  }
};

const getQrList = async (product_id) => {
  try {
    const pool = await mssql.pool;
    const queryRes = await pool
      .request()
      .input('PRODUCTID', product_id)
      .execute('NEWS_NEWS_GetListQr');
    if (queryRes.recordsets && queryRes.recordsets.length) {
      let data = productClass.qrList(queryRes.recordsets[0]);
      return data;
    }
  } catch (error) {
    logger.error(e, {
      function: 'ProductService.getQRList',
    });
    return new ServiceResponse(false, e.message);
  }
};

const getProductRelated = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    if (!apiHelper.getValueFromObject(queryParams, 'product_id')) {
      return new ServiceResponse(true, '', {
        data: [],
        page: currentPage,
        limit: itemsPerPage,
        total: 0,
      });
    }

    const pool = await mssql.pool;
    const { recordset } = await pool
      .request()
      .input(
        'PRODUCTID',
        apiHelper.getValueFromObject(queryParams, 'product_id')
      )
      .input(
        'PRODUCTCATEGORYID',
        apiHelper.getValueFromObject(queryParams, 'product_category_id')
      )
      .input(
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'created_date_from')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'created_date_to')
      )
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETLISTPRODUCTRELATED);

    return new ServiceResponse(true, '', {
      data: productClass.listProductRelated(recordset),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(recordset),
    });
  } catch (e) {
    logger.error(e, {
      function: 'ProductService.getProductRelated',
    });
    return new ServiceResponse(false, e.message);
  }
};

const getProductRelatedModal = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const { recordset } = await pool
      .request()
      .input(
        'PRODUCTCATEGORYID',
        apiHelper.getValueFromObject(queryParams, 'product_category_id')
      )
      .input(
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'created_date_from')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'created_date_to')
      )
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input(
        'IGNORELIST',
        apiHelper.getValueFromObject(queryParams, 'ignore_list', '')
      )
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETLISTPRODUCTRELATEDMODEL);

    return new ServiceResponse(true, '', {
      data: productClass.list(recordset),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(recordset),
    });
  } catch (e) {
    logger.error(e, {
      function: 'ProductService.getProductRelatedModal',
    });
    return new ServiceResponse(false, e.message);
  }
};
const updateProductRelated = async (body = {}) => {
  try {
    const product_id = apiHelper.getValueFromObject(body, 'product_id');
    const createList = apiHelper.getValueFromObject(body, 'create_list', []);
    const deleteList = apiHelper.getValueFromObject(body, 'delete_list', []);
    const user = apiHelper.getValueFromObject(body, 'auth_name');

    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();

    for (let i = 0; i < createList.length; i++) {
      const req = new sql.Request(transaction);
      await req
        .input('PARENTID', product_id)
        .input('PRODUCTID', createList[i])
        .input('CREATEDUSER', user)
        .execute(PROCEDURE_NAME.MD_PRODUCT_CREATEPRODUCTRELATED);
    }
    for (let i = 0; i < deleteList.length; i++) {
      const req = new sql.Request(transaction);
      await req
        .input('PRODUCTRELATEDID', deleteList[i])
        .input('DELETEDUSER', user)
        .execute(PROCEDURE_NAME.MD_PRODUCT_DELETEPRODUCTRELATED);
    }
    await transaction.commit();
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'ProductService.updateProductRelated',
    });
    return new ServiceResponse(false, e.message);
  }
};


const getListAttributesGroup = async () => {
  try {

    const pool = await mssql.pool;
    const res = await pool.request()
      .execute('FOR_ATTRIBUTESGROUP_GetList_AdminWeb')

    let listAttributesGroup = productClass.listAttributesGroup(res.recordsets[0]);
    let listInterpret = productClass.listInterpret(res.recordsets[1])

    if (listAttributesGroup && listAttributesGroup.length > 0) {
      for (let index = 0; index < listAttributesGroup.length; index++) {
        let attributesGroup = listAttributesGroup[index];
        let interpretOfGroup = listInterpret.filter(p => p.attributes_group_id == attributesGroup.attributes_group_id);
        attributesGroup.interprets = interpretOfGroup ? interpretOfGroup : []
      }
    }

    return new ServiceResponse(true, "", listAttributesGroup)

  } catch (error) {
    logger.error(e, {
      function: 'product.service.getListAttributesGroup',
    });
    return new ServiceResponse(false, e.message);
  }
}

module.exports = {
  getListProduct,
  createProductOrUpdate,
  detailProduct,
  deleteProduct,
  changeStatusProduct,
  getOptions,
  getOrderNumber,
  getQrList,
  getProductRelated,
  getProductRelatedModal,
  updateProductRelated,
  getListAttributesGroup
};
