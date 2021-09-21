const producCategoryClass = require('../product-category/product-category.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const savedFolder = 'product_category';
const { saveImage } = require('../../common/helpers/saveFile.helper');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListProductCategory = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input(
        'COMPANYID',
        apiHelper.getValueFromObject(queryParams, 'company_id')
      )
      .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_GETLIST);

    const lists = data.recordset;

    return new ServiceResponse(true, '', {
      data: producCategoryClass.list(lists),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(lists),
    });
  } catch (e) {
    logger.error(e, {
      function: 'productCategoryService.getListProductCategory',
    });
    return new ServiceResponse(true, '', {});
  }
};

const detail = async (Id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PRODUCTCATEGORYID', Id)
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_GETBYID);
    let category = data.recordset;
    // If exists MD_AREA
    if (category && category.length > 0) {
      category = producCategoryClass.detail(category[0]);
      return new ServiceResponse(true, '', category);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'productCategoryService.detail' });
    return new ServiceResponse(false, e.message);
  }
};

const getListAttributeByCategory = async (Id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PRODUCTCATEGORYID', Id)
      .execute(PROCEDURE_NAME.PRO_CATE_ATTRIBUTE_GETLISTBYCATEGORY);

    const datas = data.recordset;

    return new ServiceResponse(
      true,
      '',
      producCategoryClass.listAttributeByCategory(datas)
    );
  } catch (e) {
    logger.error(e, {
      function: 'productCategoryService.getListAttributeByCategory',
    });
    return new ServiceResponse(true, '', {});
  }
};


const createProductCategoryOrUpdates = async (bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    const pathIcon = await saveImage(
      savedFolder,
      apiHelper.getValueFromObject(bodyParams, 'banner_url')
    );
    // create table ProductCategotyCreate
    if (pathIcon === null || pathIcon === undefined || pathIcon === '') {
      return new ServiceResponse(
        false,
        RESPONSE_MSG.PRODUCTCATEGORY.SAVEIMG_FAILED
      );
    }

    //Upload List Image
    let images_url = apiHelper.getValueFromObject(bodyParams, 'images_url', []);
    if (images_url.length > 0) {
      for (let index = 0; index < images_url.length; index++) {
        let img = images_url[index];
        let path_picture_url = await saveImage(savedFolder, img.picture_url);

        if (path_picture_url === null || path_picture_url === undefined || path_picture_url === '') {
          return new ServiceResponse(
            false,
            RESPONSE_MSG.PRODUCTCATEGORY.SAVEIMG_FAILED
          );
        }
        else {
          img.picture_url = path_picture_url;
        }
      }
    }


    await transaction.begin();

    const requestProductCategotyCreate = new sql.Request(transaction);
    const dataProductCategotyCreate = await requestProductCategotyCreate
      .input(
        'PRODUCTCATEGORYID',
        apiHelper.getValueFromObject(bodyParams, 'product_category_id')
      )
      .input(
        'COMPANYID',
        apiHelper.getValueFromObject(bodyParams, 'company_id')
      )
      .input(
        'CATEGORYNAME',
        apiHelper.getValueFromObject(bodyParams, 'category_name')
      )
      .input(
        'ISSHOWWEB',
        apiHelper.getValueFromObject(bodyParams, 'is_show_web')
      )
      .input(
        'NAMESHOWWEB',
        apiHelper.getValueFromObject(bodyParams, 'name_show_web')
      )
      .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
      .input(
        'METADESCRIPTIONS',
        apiHelper.getValueFromObject(bodyParams, 'meta_descriptions')
      )
      .input(
        'METAKEYWORDS',
        apiHelper.getValueFromObject(bodyParams, 'meta_keywords')
      )
      .input('BANNERURL', pathIcon)
      .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
      .input(
        'DESCRIPTIONS',
        apiHelper.getValueFromObject(bodyParams, 'description')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_CREATEORUPDATE);

    const productCategoryId = dataProductCategotyCreate.recordset[0].RESULT;
    if (productCategoryId <= 0) {
      await transaction.rollback();
      return new ServiceResponse(
        false,
        RESPONSE_MSG.PRODUCTCATEGORY.CREATE_FAILED
      );
    }

    //Check update
    const id = apiHelper.getValueFromObject(bodyParams, 'product_category_id');
    if (id && id !== '') {
      //Xoa hinh anh
      const reqDelImage = new sql.Request(transaction);
      await reqDelImage
        .input('PRODUCTCATEGORYID', id)
        .execute('PRO_CATEGORYPICTURE_Delete_AdminWeb');
    }

    if (images_url.length > 0) {
      const reqInsImage = new sql.Request(transaction);
      for (let index = 0; index < images_url.length; index++) {
        const img = images_url[index];
        await reqInsImage
          .input('PRODUCTCATEGORYID', productCategoryId)
          .input('PICTUREURL', img.picture_url)
          .input('PICTUREALIAS', null)
          .input('ISDEFAULT', img.is_default)
          .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
          .execute('PRO_CATEGORYPICTURE_Create_AdminWeb');
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, '', productCategoryId);

  } catch (e) {
    logger.error(e, {
      function: 'productCategoryService.createProductCategoryOrUpdates',
    });
    await transaction.rollback();
    return new ServiceResponse(false);
  }
};

const changeStatusProductCategory = async (productCategoryId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('PRODUCTCATEGORYID', productCategoryId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'UPDATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_UPDATESTATUS);
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'productCategoryService.changeStatusProductCategory',
    });

    return new ServiceResponse(false);
  }
};

const deleteProductCategory = async (productCategoryId, bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  await transaction.begin();
  try {
    // check used
    const requestTaskTypeCheckUsed = new sql.Request(transaction);
    const data = await requestTaskTypeCheckUsed
      .input('PRODUCTCATEGORYID', productCategoryId)
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_CHECKUSED);
    let used = producCategoryClass.detailUsed(data.recordset);
    if (used[0].result === 1) {
      // used
      return new ServiceResponse(
        false,
        'danh mục sản phẩm đang được sử dụng bởi ' + used[0].table_used,
        null
      );
    }
    // remove table map CRM_TASKTYPE_WFOLLOW
    const requestProductAttrCategoryDelete = new sql.Request(transaction);
    const dataProductAttrCategoryDelete = await requestProductAttrCategoryDelete
      .input('PRODUCTCATEGORYID', productCategoryId)
      .input(
        'UPDATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_DELETE);
    const resultProductAttrCategoryDelete =
      dataProductAttrCategoryDelete.recordset[0].RESULT;
    if (resultProductAttrCategoryDelete <= 0) {
      return new ServiceResponse(
        false,
        RESPONSE_MSG.PRODUCTCATEGORY.DELETE_FAILED
      );
    }
    // remove table TASKTYPE
    const requestProductCategoryDelete = new sql.Request(transaction);
    const datatProductCategoryDelete = await requestProductCategoryDelete
      .input('PRODUCTCATEGORYID', productCategoryId)
      .input(
        'UPDATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_DELETE);
    const resultProductCategoryDelete =
      datatProductCategoryDelete.recordset[0].RESULT;
    if (resultProductCategoryDelete <= 0) {
      return new ServiceResponse(
        false,
        RESPONSE_MSG.PRODUCTCATEGORY.DELETE_FAILED
      );
    }
    await transaction.commit();
    return new ServiceResponse(
      true,
      RESPONSE_MSG.PRODUCTCATEGORY.DELETE_SUCCESS
    );
  } catch (e) {
    logger.error(e, {
      function: 'productCategoryService.deleteProductCategory',
    });
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};

const getOptionsAll = async (queryParams = {}) => {
  try {
    const { ids = [], is_active = true, parent_id = null } = queryParams;
    const pool = await mssql.pool;
    const { recordset } = await pool
      .request()
      .input('IDS', ids)
      .input('ISACTIVE', is_active)
      .input('PARENTID', parent_id)
      .execute('MD_PRODUCTCATEGORY_GetOptions');

    return new ServiceResponse(
      true,
      '',
      producCategoryClass.options(recordset)
    );
  } catch (e) {
    logger.error(e, { function: 'productCategoryService.getOptionsAll' });

    return new ServiceResponse(true, '', []);
  }
};
const getOptions = async function () {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('IsActive', API_CONST.ISACTIVE.ALL)
      .execute(PROCEDURE_NAME.MD_PRODUCTCATEGORY_GETOPTIONS);

    return data.recordset;
  } catch (e) {
    logger.error(e, { function: 'productCategoryService.getOptions' });
    return [];
  }
};

const getCategoryAttribute = async (query) => {
  const { product_id = null, category_id = null } = query;
  const pool = await mssql.pool;
  try {
    const { recordsets } = await pool
      .request()
      .input('PRODUCTCATEGORYID', category_id)
      .input('PRODUCTID', product_id)
      .execute('PRO_PRODUCTCATEGORY_GetListAttributeOption');
    if (recordsets.length) {
      let attribute = producCategoryClass.attributeOption(recordsets[0]);
      let attributeSelected = producCategoryClass.attributeSelectedOption(
        recordsets[1]
      );
      attributeSelected = attributeSelected.map((e) => {
        e.attribute_value_id = `s_${e.product_attribute_value_id}`;
        delete e.product_attribute_value_id;
        return e;
      });
      attribute = attribute.filter(
        (e) =>
          !attributeSelected.find(
            (item) =>
              e.attribute_value == item.attribute_value &&
              e.porduct_attribute_id == item.porduct_attribute_id
          )
      );
      let data = {};
      attribute.forEach((e) => {
        if (data[e.porduct_attribute_id]) {
          data[e.porduct_attribute_id].push({
            ...e,
            value: e.attribute_value_id,
            label: e.attribute_value,
          });
        } else {
          data[e.porduct_attribute_id] = [
            {
              ...e,
              value: e.attribute_value_id,
              label: e.attribute_value,
            },
          ];
        }
      });
      attributeSelected.forEach((e) => {
        if (data[e.porduct_attribute_id]) {
          data[e.porduct_attribute_id].push({
            ...e,
            selected: e.attribute_value_id,
            value: e.attribute_value_id,
            label: e.attribute_value,
          });
        } else {
          data[e.porduct_attribute_id] = [
            {
              ...e,
              selected: e.attribute_value_id,
              value: e.attribute_value_id,
              label: e.attribute_value,
            },
          ];
        }
      });
      const list = [];
      Object.keys(data).forEach((key) => {
        let selected = data[key].find((e) => !!e.selected);
        if (selected) {
          selected = selected.selected;
        } else {
          selected = '';
        }
        list.push({
          value: data[key][0].porduct_attribute_id,
          label: data[key][0].attribute_name,
          unit_id: data[key][0].unit_id,
          attribute_values: [
            ...data[key].filter((e) => !!e.attribute_value_id),
          ],
          selected,
        });
      });
      return list;
    }
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'productCategoryService.getCategoryAttributeOption',
    });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListProductCategory,
  detail,
  getListAttributeByCategory,
  createProductCategoryOrUpdates,
  changeStatusProductCategory,
  deleteProductCategory,
  getOptionsAll,
  getOptions,
  getCategoryAttribute,
};
