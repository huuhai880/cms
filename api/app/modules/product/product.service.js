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
const { createOrUpdatePageProduct } = require('../product-page/product-page.service');

const savedPath = 'product_image';
const getListProduct = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const is_web_view = apiHelper.getValueFromObject(
      queryParams,
      'is_web_view',
      2
    );

    const pool = await mssql.pool;
    const resProduct = await pool
      .request()
      .input('keyword', keyword)
      .input(
        'productcategoryid',
        apiHelper.getValueFromObject(queryParams, 'product_category_id', null)
      )
      .input(
        'startdate',
        apiHelper.getValueFromObject(queryParams, 'start_date', null)
      )
      .input(
        'enddate',
        apiHelper.getValueFromObject(queryParams, 'end_date', null)
      )
      .input(
        'isactive',
        apiHelper.getValueFromObject(queryParams, 'is_active', 2)
      )
      .input('ISSHOWWEB', is_web_view)
      .input('pagesize', itemsPerPage)
      .input('pageindex', currentPage)
      .execute(PROCEDURE_NAME.MD_PRODUCT_GETLIST_ADMINWEB);

    let list = productClass.list(resProduct.recordset);
    let total = apiHelper.getTotalData(resProduct.recordset);
    return new ServiceResponse(true, '', { list, total });
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
    const res = await pool
      .request()
      .execute('FOR_ATTRIBUTESGROUP_GetList_AdminWeb');

    let listAttributesGroup = productClass.listAttributesGroup(
      res.recordsets[0]
    );
    let listInterpret = productClass.listInterpret(res.recordsets[1]);

    if (listAttributesGroup && listAttributesGroup.length > 0) {
      for (let index = 0; index < listAttributesGroup.length; index++) {
        let attributesGroup = listAttributesGroup[index];
        let interpretOfGroup = listInterpret.filter(
          (p) => p.attributes_group_id == attributesGroup.attributes_group_id
        );
        attributesGroup.interprets = interpretOfGroup ? interpretOfGroup : [];
      }
    }

    return new ServiceResponse(true, '', listAttributesGroup);
  } catch (e) {
    logger.error(e, {
      function: 'product.service.getListAttributesGroup',
    });
    return new ServiceResponse(false, e.message);
  }
};
const getListInterPretAttributesGroup = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const res = await pool
      .request()
      .input(
        'ATTRIBUTESGROUPID',
        apiHelper.getValueFromObject(queryParams, 'attributes_group_id', null)
      )
      .execute('FOR_Interpret_GetListInterpretbyAttributesGruopId_AdminWeb');
    let listInterpret = productClass.listInterpret(res.recordsets[0]);

    if (listInterpret && listInterpret.length > 0) {
      let interPretIds = listInterpret
        .map((item) => item.interpret_id)
        .join(',');

      const resDetail = await pool
        .request()
        .input('INTERPRETIDS', interPretIds)
        .execute('FOR_INTERPRETDETAIL_GetListByIds_AdminWeb');
      let listInterPretDetail =
        productClass.listInterpretDetail(resDetail.recordset) || [];

      for (let index = 0; index < listInterpret.length; index++) {
        let interpret = listInterpret[index];
        let interpret_details = listInterPretDetail.filter(
          (x) => x.interpret_id == interpret.interpret_id
        );
        interpret.interpret_details = interpret_details || [];
      }
    }
    return new ServiceResponse(true, '', {
      listInterpret,
    });
  } catch (e) {
    logger.error(e, {
      function: 'product.service.getListInterPretAttributesGroup',
    });
    return new ServiceResponse(false, e.message);
  }
};
const createProduct = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    let product_images = apiHelper.getValueFromObject(
      bodyParams,
      'product_images',
      []
    );
    if (product_images.length > 0) {
      for (let index = 0; index < product_images.length; index++) {
        let image = product_images[index];
        const image_url = await saveImage('product', image.picture_url);
        if (image_url) {
          image.picture_url = image_url;
        } else {
          return new ServiceResponse(false, RESPONSE_MSG.NEWS.UPLOAD_FAILED);
        }
      }
    }

    await transaction.begin();

    //Product
    const reqProduct = new sql.Request(transaction);
    const resProduct = await reqProduct
      .input(
        'PRODUCTCATEGORYID',
        apiHelper.getValueFromObject(bodyParams, 'product_category_id', 0)
      )
      .input(
        'PRODUCTNAME',
        apiHelper.getValueFromObject(bodyParams, 'product_name', null)
      )
      .input(
        'PRODUCTNAMESHOWWEB',
        apiHelper.getValueFromObject(bodyParams, 'product_name_show_web', null)
      )
      .input(
        'URLPRODUCT',
        apiHelper.getValueFromObject(bodyParams, 'url_product', null)
      )
      .input(
        'SHORTDESCRIPTION',
        apiHelper.getValueFromObject(bodyParams, 'short_description', null)
      )
      .input(
        'PRODUCTCONTENTDETAIL',
        apiHelper.getValueFromObject(bodyParams, 'product_content_detail', null)
      )
      .input(
        'ISACTIVE',
        apiHelper.getValueFromObject(bodyParams, 'is_active', 1)
      )
      .input(
        'ISSHOWWEB',
        apiHelper.getValueFromObject(bodyParams, 'is_show_web', 0)
      )
      .input(
        'ISWEBVIEW',
        apiHelper.getValueFromObject(bodyParams, 'is_web_view', 0)
      )
      .input(
        'ISSHOWMENU',
        apiHelper.getValueFromObject(bodyParams, 'is_show_menu', 0)
      )
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator')
      )
      .execute('MD_PRODUCT_Create_AdminWeb');

    let { product_id } = resProduct.recordset[0];
    if (!product_id) {
      await transaction.rollback();
      return new ServiceResponse(false, 'Lỗi thêm mới sản phẩm', null);
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
          .input(
            'CREATEDUSER',
            apiHelper.getValueFromObject(
              bodyParams,
              'auth_name',
              'administrator'
            )
          )
          .execute('PRO_PRODUCTIMAGES_Create_AdminWeb');
      }
    }

    //Product Attribute
    let product_attributes = apiHelper.getValueFromObject(
      bodyParams,
      'product_attributes',
      []
    );
    if (product_attributes && product_attributes.length > 0) {
      const reqAttribute = new sql.Request(transaction);
      const reqInterPretDertail = new sql.Request(transaction);

      for (let index = 0; index < product_attributes.length; index++) {
        const attribute = product_attributes[index];
        let { interprets = [] } = attribute || {};
        for (let j = 0; j < interprets.length; j++) {
          const interpret = interprets[j];
          if (interpret.is_selected == true) {
            //// lưu luận giải
            await reqAttribute
              .input('PRODUCTID', product_id)
              .input('ATTRIBUTESGROUPID', attribute.attributes_group_id)
              .input('INTERPRETID', interpret.interpret_id)
              .input('INTERPRETDETAILID', interpret.interpret_detail_id)
              .input('ISSHOWSEARCHRESULT', interpret.is_show_search_result)
              .input('TEXTURL', interpret.text_url)
              .input('URL', interpret.url)
              .input(
                'CREATEDUSER',
                apiHelper.getValueFromObject(
                  bodyParams,
                  'auth_name',
                  'administrator'
                )
              )
              .execute('MD_PRODUCT_ATTRIBUTES_Create_AdminWeb');
            ////lưu luận giải con
            if (
              interpret.interpret_details &&
              interpret.interpret_details.length
            ) {
              for (
                let index = 0;
                index < interpret.interpret_details.length;
                index++
              ) {
                const element = interpret.interpret_details[index];
                if (element.is_selected == true) {
                  await reqInterPretDertail
                    .input('PRODUCTID', product_id)
                    .input('ATTRIBUTESGROUPID', attribute.attributes_group_id)
                    .input('INTERPRETID', interpret.interpret_id)
                    .input('INTERPRETDETAILID', element.interpret_detail_id)
                    .input('ISSHOWSEARCHRESULT', element.is_show_search_result)
                    .input('TEXTURL', element.text_url)
                    .input('URL', element.url)
                    .input(
                      'CREATEDUSER',
                      apiHelper.getValueFromObject(
                        bodyParams,
                        'auth_name',
                        'administrator'
                      )
                    )
                    .execute('MD_PRODUCT_ATTRIBUTES_Create_AdminWeb');
                }
              }
            }
          }
        }
      }
    }

    // tạo product page
    // let product_page = apiHelper.getValueFromObject(
    //   bodyParams,
    //   'product_page',
    //   []
    // );

    // if (product_page && product_page.length > 0) {
    //   const reqProductPage = new sql.Request(transaction);
    //   for (let i = 0; i < product_page.length; i++) {
    //     const data_child = product_page[i].data_child;
    //     for (let j = 0; j < data_child.length; j++) {
    //       const data_selected = data_child[j].data_selected;
    //       for (let k = 0; k < data_selected.length; k++) {
    //         await reqProductPage
    //           .input('PRODUCTPAGEID', product_page[i].id_product_page)
    //           .input('PRODUCTID', product_id)
    //           .input('PAGEID', product_page[i].product_page_id)
    //           .input('ATTRIBUTESGROUPID', data_selected[k].attributes_group_id)
    //           .input('ATTRIBUTEID', data_selected[k].attributes_id)
    //           .input('INTERPRETID', data_selected[k].interpret_id)
    //           .input('INTERPRETDETAILID', data_selected[k].interpret_detail_id)
    //           .input('ORDERINDEX', data_child[j].show_index)
    //           .input('ORDERINDEXINTERPRET', data_selected[k].showIndex)
    //           .input('CREATEDUSER', apiHelper.getValueFromObject(
    //             bodyParams,
    //             'auth_name',
    //             'administrator'
    //           ))
    //           .execute('MD_PRODUCT_PAGE_CreateOrUpdate_AdminWeb');
    //       }
    //     }
    //   }
    // }
    //--- end --



    await transaction.commit();
    removeCacheOptions();
    return new ServiceResponse(true, '', product_id);
  } catch (e) {
    await transaction.rollback();

    logger.error(e, {
      function: 'product.service.createProduct',
    });
    return new ServiceResponse(false, e.message);
  }
};

const updateProduct = async (bodyParams = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    let product_images = apiHelper.getValueFromObject(
      bodyParams,
      'product_images',
      []
    );
    if (product_images.length > 0) {
      for (let index = 0; index < product_images.length; index++) {
        let image = product_images[index];
        const image_url = await saveImage('product', image.picture_url);
        if (image_url) {
          image.picture_url = image_url;
        } else {
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
      .input(
        'PRODUCTCATEGORYID',
        apiHelper.getValueFromObject(bodyParams, 'product_category_id', 0)
      )
      .input(
        'PRODUCTNAME',
        apiHelper.getValueFromObject(bodyParams, 'product_name', null)
      )
      .input(
        'PRODUCTNAMESHOWWEB',
        apiHelper.getValueFromObject(bodyParams, 'product_name_show_web', null)
      )
      .input(
        'URLPRODUCT',
        apiHelper.getValueFromObject(bodyParams, 'url_product', null)
      )
      .input(
        'SHORTDESCRIPTION',
        apiHelper.getValueFromObject(bodyParams, 'short_description', null)
      )
      .input(
        'PRODUCTCONTENTDETAIL',
        apiHelper.getValueFromObject(bodyParams, 'product_content_detail', null)
      )
      .input(
        'ISACTIVE',
        apiHelper.getValueFromObject(bodyParams, 'is_active', 1)
      )
      .input(
        'ISSHOWWEB',
        apiHelper.getValueFromObject(bodyParams, 'is_show_web', 0)
      )
      .input(
        'ISWEBVIEW',
        apiHelper.getValueFromObject(bodyParams, 'is_web_view', 0)
      )
      .input(
        'ISSHOWMENU',
        apiHelper.getValueFromObject(bodyParams, 'is_show_menu', 0)
      )
      .input(
        'UPDATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator')
      )
      .execute('MD_PRODUCT_Update_AdminWeb');

    let { result } = resProduct.recordset[0];

    if (result == 0) {
      await transaction.rollback();
      return new ServiceResponse(false, 'Lỗi cập nhật sản phẩm', null);
    }

    //Images Product
    const reqDelImage = new sql.Request(transaction);
    await reqDelImage
      .input('PRODUCTID', product_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator')
      )
      .execute('PRO_PRODUCTIMAGES_Delete_AdminWeb');

    if (product_images && product_images.length > 0) {
      const reqImage = new sql.Request(transaction);
      for (let index = 0; index < product_images.length; index++) {
        const image = product_images[index];
        await reqImage
          .input('PRODUCTID', product_id)
          .input('PICTUREURL', image.picture_url)
          .input('ISDEFAULT', image.is_default)
          .input(
            'CREATEDUSER',
            apiHelper.getValueFromObject(
              bodyParams,
              'auth_name',
              'administrator'
            )
          )
          .execute('PRO_PRODUCTIMAGES_Create_AdminWeb');
      }
    }

    //Product Attribute
    const reqDelAttribute = new sql.Request(transaction);
    await reqDelAttribute
      .input('PRODUCTID', product_id)
      .input(
        'DELETEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator')
      )
      .execute('MD_PRODUCT_ATTRIBUTES_Delete_AdminWeb');

    let product_attributes = apiHelper.getValueFromObject(
      bodyParams,
      'product_attributes',
      []
    );
    if (product_attributes && product_attributes.length > 0) {
      const reqAttribute = new sql.Request(transaction);
      const reqInterPretDertail = new sql.Request(transaction);

      for (let index = 0; index < product_attributes.length; index++) {
        const attribute = product_attributes[index];
        let { interprets = [] } = attribute || {};
        for (let j = 0; j < interprets.length; j++) {
          const interpret = interprets[j];
          if (interpret.is_selected == true) {
            await reqAttribute
              .input('PRODUCTID', product_id)
              .input('ATTRIBUTESGROUPID', interpret.attributes_group_id)
              .input('INTERPRETID', interpret.interpret_id)
              .input('INTERPRETDETAILID', interpret.interpret_detail_id)
              .input('ISSHOWSEARCHRESULT', interpret.is_show_search_result)
              .input('TEXTURL', interpret.text_url)
              .input('URL', interpret.url)
              .input(
                'CREATEDUSER',
                apiHelper.getValueFromObject(
                  bodyParams,
                  'auth_name',
                  'administrator'
                )
              )
              .execute('MD_PRODUCT_ATTRIBUTES_Create_AdminWeb');

          }
          ////lưu luận giải con
          if (
            interpret.interpret_details &&
            interpret.interpret_details.length
          ) {
            for (
              let index = 0;
              index < interpret.interpret_details.length;
              index++
            ) {
              const element = interpret.interpret_details[index];

              if (element.is_selected == true) {
                await reqInterPretDertail
                  .input('PRODUCTID', product_id)
                  .input('ATTRIBUTESGROUPID', interpret.attributes_group_id)
                  .input('INTERPRETID', interpret.interpret_id)
                  .input('INTERPRETDETAILID', element.interpret_detail_id)
                  .input('ISSHOWSEARCHRESULT', element.is_show_search_result)
                  .input('TEXTURL', element.text_url)
                  .input('URL', element.url)
                  .input(
                    'CREATEDUSER',
                    apiHelper.getValueFromObject(
                      bodyParams,
                      'auth_name',
                      'administrator'
                    )
                  )
                  .execute('MD_PRODUCT_ATTRIBUTES_Create_AdminWeb');
              }
            }
          }
        }
      }
    }

    // ---- update product page ---
    // let product_page = apiHelper.getValueFromObject(
    //   bodyParams,
    //   'product_page',
    //   []
    // );
    // const reqDelPageProduct = new sql.Request(transaction);
    // await reqDelPageProduct
    //   .input('PRODUCTID', product_id)
    //   .input(
    //     'DELETEDUSER',
    //     apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator')
    //   )
    //   .execute('MD_PRODUCT_PAGE_DeleteProductPage_AdminWeb');

    // if (product_page && product_page.length > 0) {
    //   const reqProductPage = new sql.Request(transaction);
    //   for (let i = 0; i < product_page.length; i++) {
    //     const data_child = product_page[i].data_child;
    //     for (let j = 0; j < data_child.length; j++) {
    //       const data_selected = data_child[j].data_selected;
          
    //       for (let k = 0; k < data_selected.length; k++) {
    //         await reqProductPage
    //           .input('PRODUCTPAGEID', data_selected[k].product_page_id)
    //           .input('PRODUCTID', product_id)
    //           .input('PAGEID', product_page[i].product_page_id)
    //           .input('ATTRIBUTESGROUPID', data_selected[k].attributes_group_id)
    //           .input('ATTRIBUTEID', data_selected[k].attributes_id)
    //           .input('INTERPRETID', data_selected[k].interpret_id)
    //           .input('INTERPRETDETAILID', data_selected[k].interpret_detail_id)
    //           .input('ORDERINDEX', data_child[j].show_index)
    //           .input('ORDERINDEXINTERPRET', data_selected[k].showIndex)
    //           .input('CREATEDUSER', apiHelper.getValueFromObject(
    //             bodyParams,
    //             'auth_name',
    //             'administrator'
    //           ))
    //           .execute('MD_PRODUCT_PAGE_CreateOrUpdate_AdminWeb');
    //       }
    //     }
    //   }
    // }


    await transaction.commit();
    removeCacheOptions();
    return new ServiceResponse(true, '', true);
  } catch (e) {
    await transaction.rollback();
    logger.error(e, {
      function: 'product.service.updateProduct',
    });
    return new ServiceResponse(false, e.message);
  }
};

const detailProduct = async (product_id) => {
  try {
    const pool = await mssql.pool;
    const resProduct = await pool
      .request()
      .input('PRODUCTID', product_id)
      .execute('MD_PRODUCT_GetById_AdminWeb');

    let product_images = [];
    let product = productClass.detail(resProduct.recordsets[0][0]);
    product_images = productClass.listPicture(resProduct.recordsets[1]);
    let attributes = productClass.listAttributes(resProduct.recordsets[2]);

    let product_attributes = [];
    if (attributes && attributes.length > 0) {
      for (let index = 0; index < attributes.length; index++) {
        const attr = attributes[index];
        let { attributes_group_id, product_id } = attr || {};
        product_attributes.push({
          attributes_group_id,
          product_id,
        });
      }
    }
    for (let index = 0; index < product_attributes.length; index++) {
      const element = product_attributes[index];
      const res = await pool
        .request()
        .input(
          'ATTRIBUTESGROUPID',
          apiHelper.getValueFromObject(element, 'attributes_group_id', null)
        )
        .input(
          'PRODUCTID',
          apiHelper.getValueFromObject(element, 'product_id', null)
        )
        .execute('FOR_Interpret_GetListInterpretbyAttributesGruopId_AdminWeb');
      let listInterpret = productClass.listInterpret(res.recordsets[1]);

      if (listInterpret && listInterpret.length > 0) {
        let interPretIds = listInterpret
          .map((item) => item.interpret_id)
          .join(',');
        const resDetail = await pool
          .request()
          .input('INTERPRETIDS', interPretIds)
          .input(
            'PRODUCTID',
            apiHelper.getValueFromObject(element, 'product_id', null)
          )
          .execute('FOR_INTERPRETDETAIL_GetListByIds_AdminWeb');
        let listInterPretDetail =
          productClass.listInterpretDetail(resDetail.recordsets[1]) || [];
        for (let index = 0; index < listInterpret.length; index++) {
          let interpret = listInterpret[index];
          let interpret_details = listInterPretDetail.filter(
            (x) => x.interpret_id == interpret.interpret_id
          );
          interpret.interpret_details = interpret_details || [];
        }
        product_attributes[index].interprets = listInterpret;
      }
    }


    // get detail product page
    let product_page = [];
    const product_page_detail = await pool
      .request()
      .input(
        'PRODUCTID',
        product_id
      )
      .execute('MD_PRODUCT_PAGE_GetListPage_AdminWeb');
    const result_page = productClass.list_page_product(product_page_detail.recordset);
    // data child
    for (let i = 0; i < result_page.length; i++) {
      let page_product = {
        product_page_id: result_page[i].page_id,
        title_page: result_page[i].title_page,
        data_child: []
      }
      const att_group_detail = await pool
        .request()
        .input('PRODUCTID', product_id)
        .input('PAGEID', result_page[i].page_id)
        .execute('MD_PRODUCT_PAGE_GetAttGroup_AdminWeb');

      const result_AttGroup_Page = productClass.listAttGroupProductPage(att_group_detail.recordset);
      for (let j = 0; j < result_AttGroup_Page.length; j++) {
        const interpert_detail = await pool
          .request()
          .input('PRODUCTID', product_id)
          .input('PAGEID', result_page[i].page_id)
          .input('ATTRIBUTESGROUPID', result_AttGroup_Page[j].attributes_group_id)
          .execute('MD_PRODUCT_PAGE_GetIntePertDetail_AdminWeb');
        const interpert_page = productClass.listInterPertPage(interpert_detail.recordset);

        const interpert_list = await pool
          .request()
          .input('ATTRIBUTESGROUPID', result_AttGroup_Page[j].attributes_group_id)
          .execute('MD_PRODUCT_PAGE_GetListInterPret_AdminWeb');
        const interpert = productClass.listInterPertPage(interpert_list.recordset);
        page_product.data_child.push(
          {
            attributes_group_id: result_AttGroup_Page[j].attributes_group_id,
            show_index: result_AttGroup_Page[j].order_index,
            data_interpret: [...interpert],
            data_selected: [...interpert_page],
          }
        )
      }

      product_page.push(page_product);
    }

    if (product) {
      product.product_images = product_images;
      product.product_attributes = product_attributes;
      product.product_page = product_page;

    }

    return new ServiceResponse(true, '', product);
  } catch (e) {
    logger.error(e, {
      function: 'product.service.detailProduct',
    });
    return new ServiceResponse(false, e.message);
  }
};

// get option page
const getOptionsPage = () => {

}

module.exports = {
  getListProduct,
  deleteProduct,
  getOptions,
  getListAttributesGroup,
  createProduct,
  updateProduct,
  detailProduct,
  getListInterPretAttributesGroup,
};
