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

const deleteProduct = async (product_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('PRODUCTID', product_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute('MD_PRODUCT_Delete_AdminWeb');
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'product.service.deleteProduct',
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

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.MD_PRODUCT_OPTIONS);
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

  } catch (e) {
    logger.error(e, {
      function: 'product.service.getListAttributesGroup',
    });
    return new ServiceResponse(false, e.message);
  }
}

const createProduct = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {

    let product_images = apiHelper.getValueFromObject(bodyParams, 'product_images', []);
    if (product_images.length > 0) {
      for (let index = 0; index < product_images.length; index++) {
        let image = product_images[index];
        const image_url = await saveImage('product', image.picture_url);
        if (image_url) {
          image.picture_url = image_url
        }
        else {
          return new ServiceResponse(false, RESPONSE_MSG.NEWS.UPLOAD_FAILED);
        }
      }
    }

    await transaction.begin();

    //Product
    const reqProduct = new sql.Request(transaction);
    const resProduct = await reqProduct
      .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id', 0))
      .input('PRODUCTNAME', apiHelper.getValueFromObject(bodyParams, 'product_name', null))
      .input('PRODUCTNAMESHOWWEB', apiHelper.getValueFromObject(bodyParams, 'product_name_show_web', null))
      .input('URLPRODUCT', apiHelper.getValueFromObject(bodyParams, 'url_product', null))
      .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description', null))
      .input('PRODUCTCONTENTDETAIL', apiHelper.getValueFromObject(bodyParams, 'product_content_detail', null))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
      .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web', 0))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
      .execute('MD_PRODUCT_Create_AdminWeb')

    let { product_id } = resProduct.recordset[0];
    if (!product_id) {
      await transaction.rollback();
      return new ServiceResponse(
        false,
        "Lỗi thêm mới sản phẩm",
        null
      );
    }

    //Images Product
    if (product_images && product_images.length > 0) {
      const reqImage = new sql.Request(transaction);
      for (let index = 0; index < product_images.length; index++) {
        const image = product_images[index];
        await reqImage
          .input('PRODUCTID', product_id)
          .input('PICTUREURL', image.picture_url)
          .input('ISDEFAULT', image.is_default)
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
          .execute('PRO_PRODUCTIMAGES_Create_AdminWeb')
      }
    }

    //Product Attribute
    let product_attributes = apiHelper.getValueFromObject(bodyParams, 'product_attributes', []);
    if (product_attributes && product_attributes.length > 0) {
      const reqAttribute = new sql.Request(transaction);
      for (let index = 0; index < product_attributes.length; index++) {
        const attribute = product_attributes[index];
        let { interprets = [] } = attribute || {}
        for (let j = 0; j < interprets.length; j++) {
          const interpret = interprets[j];

          await reqAttribute.input('PRODUCTID', product_id)
            .input('ATTRIBUTESGROUPID', attribute.attributes_group_id)
            .input('INTERPRETID', interpret.interpret_id)
            .input('INTERPRETDETAILID', interpret.interpret_detail_id)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('MD_PRODUCT_ATTRIBUTES_Create_AdminWeb')
        }
      }
    }

    await transaction.commit();
    removeCacheOptions();
    return new ServiceResponse(true, "", product_id)

  } catch (e) {
    await transaction.rollback()
   
    logger.error(e, {
      function: 'product.service.createProduct',
    });
    return new ServiceResponse(false, e.message);
  }
}

const updateProduct = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {

    let product_images = apiHelper.getValueFromObject(bodyParams, 'product_images', []);
    if (product_images.length > 0) {
      for (let index = 0; index < product_images.length; index++) {
        let image = product_images[index];
        const image_url = await saveImage('product', image.picture_url);
        if (image_url) {
          image.picture_url = image_url
        }
        else {

          return new ServiceResponse(false, RESPONSE_MSG.NEWS.UPLOAD_FAILED);
        }
      }
    }

    await transaction.begin();

    let product_id = apiHelper.getValueFromObject(bodyParams, 'product_id', 0);

    //Product
    const reqProduct = new sql.Request(transaction);
    const resProduct = await reqProduct
      .input('PRODUCTID', product_id)
      .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id', 0))
      .input('PRODUCTNAME', apiHelper.getValueFromObject(bodyParams, 'product_name', null))
      .input('PRODUCTNAMESHOWWEB', apiHelper.getValueFromObject(bodyParams, 'product_name_show_web', null))
      .input('URLPRODUCT', apiHelper.getValueFromObject(bodyParams, 'url_product', null))
      .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description', null))
      .input('PRODUCTCONTENTDETAIL', apiHelper.getValueFromObject(bodyParams, 'product_content_detail', null))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
      .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web', 0))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
      .execute('MD_PRODUCT_Update_AdminWeb')

    let { result } = resProduct.recordset[0];

    if (result == 0) {
      await transaction.rollback();
      return new ServiceResponse(
        false,
        "Lỗi cập nhật sản phẩm",
        null
      );
    }


    //Images Product
    const reqDelImage = new sql.Request(transaction);
    await reqDelImage
      .input('PRODUCTID', product_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
      .execute('PRO_PRODUCTIMAGES_Delete_AdminWeb')

    if (product_images && product_images.length > 0) {
      const reqImage = new sql.Request(transaction);
      for (let index = 0; index < product_images.length; index++) {
        const image = product_images[index];
        await reqImage
          .input('PRODUCTID', product_id)
          .input('PICTUREURL', image.picture_url)
          .input('ISDEFAULT', image.is_default)
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
          .execute('PRO_PRODUCTIMAGES_Create_AdminWeb')
      }
    }


    //Product Attribute
    const reqDelAttribute = new sql.Request(transaction);
    await reqDelAttribute
      .input('PRODUCTID', product_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
      .execute('MD_PRODUCT_ATTRIBUTES_Delete_AdminWeb')

    let product_attributes = apiHelper.getValueFromObject(bodyParams, 'product_attributes', []);
    if (product_attributes && product_attributes.length > 0) {
      const reqAttribute = new sql.Request(transaction);
      for (let index = 0; index < product_attributes.length; index++) {
        const attribute = product_attributes[index];
        let { interprets = [] } = attribute || {}
        for (let j = 0; j < interprets.length; j++) {
          const interpret = interprets[j];

          await reqAttribute
            .input('PRODUCTID', product_id)
            .input('ATTRIBUTESGROUPID', attribute.attributes_group_id)
            .input('INTERPRETID', interpret.interpret_id)
            .input('INTERPRETDETAILID', interpret.interpret_detail_id)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('MD_PRODUCT_ATTRIBUTES_Update_AdminWeb')
        }
      }
    }

    await transaction.commit();
    removeCacheOptions();
    return new ServiceResponse(true, "", true)
  } catch (e) {
    await transaction.rollback()
    logger.error(e, {
      function: 'product.service.updateProduct',
    });
    return new ServiceResponse(false, e.message);
  }
}

const detailProduct = async (product_id) => {
  try {
    const pool = await mssql.pool;
    const resProduct = await pool.request()
      .input('PRODUCTID', product_id)
      .execute('MD_PRODUCT_GetById_AdminWeb')

    let product_images = []
    let product = productClass.detail(resProduct.recordsets[0][0]);
    product_images = productClass.listPicture(resProduct.recordsets[1]);
    let attributes = productClass.listAttributes(resProduct.recordsets[2])

    let product_attributes = [];
    if (attributes && attributes.length > 0) {
      for (let index = 0; index < attributes.length; index++) {
        const attr = attributes[index];
        let {
          attributes_group_id,
          attribute_id,
          interpret_id,
          interpret_detail_id,
          product_id
        } = attr || {}
        let find = product_attributes.find(p => p.attributes_group_id == attributes_group_id);
        if (!find) {
          product_attributes.push({
            attributes_group_id,
            product_id,
            interprets: [{
              attribute_id,
              interpret_id,
              interpret_detail_id
            }]
          })
        }
        else {
          find.interprets = [...find.interprets, {
            attribute_id,
            interpret_id,
            interpret_detail_id
          }]
        }
      }
    }
    if (product) {
      product.product_images = product_images;
      product.product_attributes = product_attributes
    }

    return new ServiceResponse(true, "", product)

  } catch (e) {
    logger.error(e, {
      function: 'product.service.detailProduct',
    });
    return new ServiceResponse(false, e.message);
  }
}

module.exports = {
  getListProduct,
  deleteProduct,
  getOptions,
  getListAttributesGroup,
  createProduct,
  updateProduct,
  detailProduct
};
