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
const _ = require('lodash');
const productPageService = require('../product-page/product-page.service')

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
        let product_images = apiHelper.getValueFromObject(bodyParams, 'product_images', []);
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
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id', 0))
            .input('PRODUCTNAME', apiHelper.getValueFromObject(bodyParams, 'product_name', null))
            .input('PRODUCTNAMESHOWWEB', apiHelper.getValueFromObject(bodyParams, 'product_name_show_web', null))
            .input('URLPRODUCT', apiHelper.getValueFromObject(bodyParams, 'url_product', null))
            .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description', null))
            .input('PRODUCTCONTENTDETAIL', apiHelper.getValueFromObject(bodyParams, 'product_content_detail', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web', 0))
            .input('ISWEBVIEW', apiHelper.getValueFromObject(bodyParams, 'is_web_view', 0))
            .input('ISSHOWMENU', apiHelper.getValueFromObject(bodyParams, 'is_show_menu', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .input('LINKLANDINGPAGE', apiHelper.getValueFromObject(bodyParams, 'link_landing_page', null))
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
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
                    .execute('PRO_PRODUCTIMAGES_Create_AdminWeb');
            }
        }

        let product_attributes = apiHelper.getValueFromObject(bodyParams, 'product_attributes', []);
        if (product_attributes && product_attributes.length > 0) {
            const table = new sql.Table('MD_PRODUCT_ATTRIBUTES')
            table.create = false;
            table.columns.add('PRODUCTID', sql.BigInt, { nullable: false });
            table.columns.add('ISACTIVE', sql.Bit, { nullable: false });
            table.columns.add('CREATEDUSER', sql.VarChar, { nullable: false });
            table.columns.add('CREATEDDATE', sql.DateTime, { nullable: false });
            table.columns.add('UPDATEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('UPDATEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('ISDELETED', sql.Bit, { nullable: true });
            table.columns.add('DELETEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('DELETEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('ATTRIBUTESGROUPID', sql.BigInt, { nullable: false });
            table.columns.add('INTERPRETID', sql.BigInt, { nullable: false });
            table.columns.add('INTERPRETDETAILID', sql.BigInt, { nullable: true });
            table.columns.add('ISSHOWSEARCHRESULT', sql.Bit, { nullable: true });
            table.columns.add('URL', sql.NVarChar, { nullable: true });
            table.columns.add('TEXTURL', sql.NVarChar, { nullable: true });
            table.columns.add('ORDERINDEX', sql.BigInt, { nullable: true });

            for (let i = 0; i < product_attributes.length; i++) {
                let attributesGroup = product_attributes[i];
                table.rows.add(
                    product_id, //PRODUCTID
                    true, //ISACTIVE
                    apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'), //CREATEDUSER
                    new Date(), //CREATEDDATE
                    null, //UPDATEDUSER
                    null, //UPDATEDDATE
                    false, //ISDELETED
                    null, //DELETEDUSER
                    null, //DELETEDDATE
                    attributesGroup.attributes_group_id, //ATTRIBUTESGROUPID
                    attributesGroup.interpret_id, //INTERPRETID
                    attributesGroup.interpret_detail_id, //INTERPRETDETAILID
                    attributesGroup.is_show_search_result, //ISSHOWSEARCHRESULT
                    attributesGroup.url, //URL
                    attributesGroup.text_url, //TEXTURL
                    attributesGroup.order_index //ORDERINDEX
                )
            }
            const reqProductAttr = new sql.Request(transaction);
            const results = await reqProductAttr.bulk(table);
            console.log(`MD_PRODUCT_ATTRIBUTES rows affected ${results.rowsAffected}`);
        }

        let product_page = apiHelper.getValueFromObject(bodyParams, 'product_page', []);
        if (product_page && product_page.length > 0) {
            const table = new sql.Table('MD_PRODUCT_PAGE')
            table.create = false;
            table.columns.add('PRODUCTID', sql.BigInt, { nullable: true });
            table.columns.add('PAGEID', sql.BigInt, { nullable: true });
            table.columns.add('ATTRIBUTESGROUPID', sql.BigInt, { nullable: true });
            table.columns.add('ATTRIBUTEID', sql.BigInt, { nullable: true });
            table.columns.add('INTERPRETID', sql.BigInt, { nullable: true });
            table.columns.add('INTERPRETDETAILID', sql.BigInt, { nullable: true });
            table.columns.add('ORDERINDEX', sql.BigInt, { nullable: true });
            table.columns.add('CREATEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('CREATEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('UPDATEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('UPDATEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('ISDELETED', sql.Bit, { nullable: true });
            table.columns.add('DELETEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('DELETEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('ISACTIVE', sql.Bit, { nullable: true });
            table.columns.add('ORDERINDEXINTERPRET', sql.BigInt, { nullable: true });
            table.columns.add('ISINTERPRETSPECIAL', sql.Bit, { nullable: true });
            table.columns.add('ORDERINDEXPAGE', sql.BigInt, { nullable: true });

            for (let n = 0; n < product_page.length; n++) {
                const page = product_page[n];
                table.rows.add(
                    product_id, //PRODUCTID
                    page.product_page_id, //PAGEID
                    page.attributes_group_id, //ATTRIBUTESGROUPID
                    page.attributes_id, //ATTRIBUTEID
                    page.interpret_id,  //INTERPRETID
                    page.interpret_detail_id, //INTERPRETDETAILID
                    page.order_index, //ORDERINDEX
                    apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'), //CREATEDUSER
                    new Date(), //CREATEDDATE
                    null, //UPDATEDUSER
                    null, //UPDATEDDATE
                    false, //ISDELETED
                    null, //DELETEDUSER
                    null, //DELETEDDATE
                    true, //ISACTIVE
                    page.order_index_interpret, //ORDERINDEXINTERPRET
                    page.is_interpret_special, //ISINTERPRETSPECIAL
                    page.order_index_page //ORDERINDEXPAGE
                );
            }
            const reqProductPage = new sql.Request(transaction);
            const results = await reqProductPage.bulk(table);
            console.log(`MD_PRODUCT_PAGE rows affected ${results.rowsAffected}`);
        }

        await transaction.commit();
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
        let product_images = apiHelper.getValueFromObject(bodyParams, 'product_images', []);
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
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id', 0))
            .input('PRODUCTNAME', apiHelper.getValueFromObject(bodyParams, 'product_name', null))
            .input('PRODUCTNAMESHOWWEB', apiHelper.getValueFromObject(bodyParams, 'product_name_show_web', null))
            .input('URLPRODUCT', apiHelper.getValueFromObject(bodyParams, 'url_product', null))
            .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description', null))
            .input('PRODUCTCONTENTDETAIL', apiHelper.getValueFromObject(bodyParams, 'product_content_detail', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web', 0))
            .input('ISWEBVIEW', apiHelper.getValueFromObject(bodyParams, 'is_web_view', 0))
            .input('ISSHOWMENU', apiHelper.getValueFromObject(bodyParams, 'is_show_menu', 0))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .input('LINKLANDINGPAGE', apiHelper.getValueFromObject(bodyParams, 'link_landing_page', null))
            .execute('MD_PRODUCT_Update_AdminWeb');


        let { result } = resProduct.recordset[0];

        if (result == 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi cập nhật sản phẩm', null);
        }

        //Delete Images Product
        const reqDelImage = new sql.Request(transaction);
        await reqDelImage
            .input('PRODUCTID', product_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('PRO_PRODUCTIMAGES_Delete_AdminWeb');

        if (product_images && product_images.length > 0) {
            const reqImage = new sql.Request(transaction);
            for (let index = 0; index < product_images.length; index++) {
                const image = product_images[index];
                await reqImage
                    .input('PRODUCTID', product_id)
                    .input('PICTUREURL', image.picture_url)
                    .input('ISDEFAULT', image.is_default)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
                    .execute('PRO_PRODUCTIMAGES_Create_AdminWeb');
            }
        }

        //Delete Attributes Of Product
        const reqDelAttribute = new sql.Request(transaction);
        await reqDelAttribute
            .input('PRODUCTID', product_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('MD_PRODUCT_ATTRIBUTES_Delete_AdminWeb');

        let product_attributes = apiHelper.getValueFromObject(bodyParams, 'product_attributes', []);
        if (product_attributes && product_attributes.length > 0) {
            const table = new sql.Table('MD_PRODUCT_ATTRIBUTES')
            table.create = false;
            table.columns.add('PRODUCTID', sql.BigInt, { nullable: false });
            table.columns.add('ISACTIVE', sql.Bit, { nullable: false });
            table.columns.add('CREATEDUSER', sql.VarChar, { nullable: false });
            table.columns.add('CREATEDDATE', sql.DateTime, { nullable: false });
            table.columns.add('UPDATEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('UPDATEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('ISDELETED', sql.Bit, { nullable: true });
            table.columns.add('DELETEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('DELETEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('ATTRIBUTESGROUPID', sql.BigInt, { nullable: false });
            table.columns.add('INTERPRETID', sql.BigInt, { nullable: false });
            table.columns.add('INTERPRETDETAILID', sql.BigInt, { nullable: true });
            table.columns.add('ISSHOWSEARCHRESULT', sql.Bit, { nullable: true });
            table.columns.add('URL', sql.NVarChar, { nullable: true });
            table.columns.add('TEXTURL', sql.NVarChar, { nullable: true });
            table.columns.add('ORDERINDEX', sql.BigInt, { nullable: true });

            for (let i = 0; i < product_attributes.length; i++) {
                let attributesGroup = product_attributes[i];
                table.rows.add(
                    product_id, //PRODUCTID
                    true, //ISACTIVE
                    apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'), //CREATEDUSER
                    new Date(), //CREATEDDATE
                    null, //UPDATEDUSER
                    null, //UPDATEDDATE
                    false, //ISDELETED
                    null, //DELETEDUSER
                    null, //DELETEDDATE
                    attributesGroup.attributes_group_id, //ATTRIBUTESGROUPID
                    attributesGroup.interpret_id, //INTERPRETID
                    attributesGroup.interpret_detail_id, //INTERPRETDETAILID
                    attributesGroup.is_show_search_result, //ISSHOWSEARCHRESULT
                    attributesGroup.url, //URL
                    attributesGroup.text_url, //TEXTURL
                    attributesGroup.order_index //ORDERINDEX
                )
            }
            const reqProductAttr = new sql.Request(transaction);
            const results = await reqProductAttr.bulk(table);
            console.log(`MD_PRODUCT_ATTRIBUTES rows affected ${results.rowsAffected}`);


            //const reqAttribute = new sql.Request(transaction);
            // for (let i = 0; i < product_attributes.length; i++) {
            //     let attributesGroup = product_attributes[i];
            //     await pool.request()
            //         .input('PROATTRIBUTESID', attributesGroup.product_attribute_id)
            //         .input('PRODUCTID', product_id)
            //         .input('ATTRIBUTESGROUPID', attributesGroup.attributes_group_id)
            //         .input('INTERPRETID', attributesGroup.interpret_id)
            //         .input('INTERPRETDETAILID', attributesGroup.interpret_detail_id)
            //         .input('ISSHOWSEARCHRESULT', attributesGroup.is_show_search_result)
            //         .input('TEXTURL', attributesGroup.text_url)
            //         .input('URL', attributesGroup.url)
            //         .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            //         .input('ORDERINDEX', attributesGroup.order_index)
            //         .execute('MD_PRODUCT_ATTRIBUTES_Create_AdminWeb');
            // }
        }

        //Delete Page Of Product
        let product_page = apiHelper.getValueFromObject(bodyParams, 'product_page', []);
        const reqDelPageProduct = new sql.Request(transaction);
        await reqDelPageProduct
            .input('PRODUCTID', product_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .execute('MD_PRODUCT_PAGE_DeleteProductPage_AdminWeb');

        if (product_page && product_page.length > 0) {
            const table = new sql.Table('MD_PRODUCT_PAGE')
            table.create = false;
            table.columns.add('PRODUCTID', sql.BigInt, { nullable: true });
            table.columns.add('PAGEID', sql.BigInt, { nullable: true });
            table.columns.add('ATTRIBUTESGROUPID', sql.BigInt, { nullable: true });
            table.columns.add('ATTRIBUTEID', sql.BigInt, { nullable: true });
            table.columns.add('INTERPRETID', sql.BigInt, { nullable: true });
            table.columns.add('INTERPRETDETAILID', sql.BigInt, { nullable: true });
            table.columns.add('ORDERINDEX', sql.BigInt, { nullable: true });
            table.columns.add('CREATEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('CREATEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('UPDATEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('UPDATEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('ISDELETED', sql.Bit, { nullable: true });
            table.columns.add('DELETEDUSER', sql.VarChar, { nullable: true });
            table.columns.add('DELETEDDATE', sql.DateTime, { nullable: true });
            table.columns.add('ISACTIVE', sql.Bit, { nullable: true });
            table.columns.add('ORDERINDEXINTERPRET', sql.BigInt, { nullable: true });
            table.columns.add('ISINTERPRETSPECIAL', sql.Bit, { nullable: true });
            table.columns.add('ORDERINDEXPAGE', sql.BigInt, { nullable: true });

            for (let n = 0; n < product_page.length; n++) {
                const page = product_page[n];
                table.rows.add(
                    product_id, //PRODUCTID
                    page.product_page_id, //PAGEID
                    page.attributes_group_id, //ATTRIBUTESGROUPID
                    page.attributes_id, //ATTRIBUTEID
                    page.interpret_id,  //INTERPRETID
                    page.interpret_detail_id, //INTERPRETDETAILID
                    page.order_index, //ORDERINDEX
                    apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'), //CREATEDUSER
                    new Date(), //CREATEDDATE
                    null, //UPDATEDUSER
                    null, //UPDATEDDATE
                    false, //ISDELETED
                    null, //DELETEDUSER
                    null, //DELETEDDATE
                    true, //ISACTIVE
                    page.order_index_interpret, //ORDERINDEXINTERPRET
                    page.is_interpret_special, //ISINTERPRETSPECIAL
                    page.order_index_page //ORDERINDEXPAGE
                );
            }
            const reqProductPage = new sql.Request(transaction);
            const results = await reqProductPage.bulk(table);
            console.log(`MD_PRODUCT_PAGE rows affected ${results.rowsAffected}`);

            // const reqProductPage = new sql.Request(transaction);
            // for (let n = 0; n < product_page.length; n++) {
            //     const page = product_page[n];
            //     await reqProductPage
            //         .input('PRODUCTPAGEID', page.id_product_page)
            //         .input('PRODUCTID', product_id)
            //         .input('PAGEID', page.product_page_id)
            //         .input('ATTRIBUTESGROUPID', page.attributes_group_id)
            //         .input('ATTRIBUTEID', page.attributes_id)
            //         .input('INTERPRETID', page.interpret_id)
            //         .input('INTERPRETDETAILID', page.interpret_detail_id)
            //         .input('ORDERINDEX', page.order_index)
            //         .input('ORDERINDEXINTERPRET', page.order_index_interpret)
            //         .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            //         .input('ISINTERPRETSPECIAL', page.is_interpret_special)
            //         .input('ORDERINDEXPAGE', page.order_index_page)
            //         .execute('MD_PRODUCT_PAGE_CreateOrUpdate_AdminWeb');
            // }
        }
        await transaction.commit();
        return new ServiceResponse(true, '', true);
    } catch (e) {
        console.log({ e })
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


        let product = productClass.detail(resProduct.recordsets[0][0]);
        let product_images = productClass.listPicture(resProduct.recordsets[1]);
        let attributes = productClass.listAttributes(resProduct.recordsets[2]);


        //LAY DU LIEU PRODUCT ATTRIBUTE V2
        let attributesGroupIds = attributes.map(p => p.attributes_group_id).join(",");
        // console.log({ attributesGroupIds })
        const resAttrV2 = await pool.request()
            .input('productid', product_id)
            .input('ATTRIBUTESGROUPIDS', attributesGroupIds)
            .execute('MD_PRODUCT_INTERPRET_GetList_AdminWeb');

        let listInterpretAll = productClass.listInterpret(resAttrV2.recordsets[0]);
        let listInterpretDetailAll = productClass.listInterpretDetail(resAttrV2.recordsets[1]);
        let product_attributes = [];
        if (attributes && attributes.length > 0) {
            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes[i];
                let { attributes_group_id, product_id } = attr || {};
                //Lấy danh sách luận giải theo Chỉ số
                let interprets = listInterpretAll.filter(p => p.attributes_group_id == attributes_group_id) || [];

                interprets = _.orderBy(interprets, ['date_sort'], ['desc']);

                //Lấy danh sách luận giải chi tiết
                for (let k = 0; k < interprets.length; k++) {
                    let _interpret = interprets[k];
                    let interpret_details = listInterpretDetailAll.filter(p => p.interpret_id == _interpret.interpret_id);
                    _interpret.interpret_details = interpret_details || [];
                }

                product_attributes.push({
                    attributes_group_id,
                    product_id,
                    interprets
                });
            }
        }

        //Lấy dữ liệu V2
        const resV2 = await pool.request()
            .input('productid', product_id)
            .execute('MD_PRODUCT_PAGE_GetData_v1_AdminWeb')

        let listPage = productClass.list_page_product(resV2.recordsets[0]);
        let listAttributesGroup = productClass.listAttGroupProductPage(resV2.recordsets[1]);
        let listInterpretPage = productClass.listInterPertPage(resV2.recordsets[2]);
        // let listInterpret = productClass.listInterPertPage(resV2.recordsets[3]);
        let listInterpretSpecialOfPage = productClass.listInterpretSpecialOfPage(resV2.recordsets[3]);

        let product_page = [];
        for (let i = 0; i < listPage.length; i++) {
            let _page = listPage[i];
            let page_product = {
                product_page_id: _page.page_id,
                title_page: _page.page_name,
                data_child: [],
                order_index_page: _page.order_index_page,
                page_type: _page.page_type
            }

            let attributesGroupOfPage = listAttributesGroup.filter(p => p.page_id == _page.page_id);
            for (let y = 0; y < attributesGroupOfPage.length; y++) {
                let _attrOfPage = attributesGroupOfPage[y];

                //Luận giải đặc biệt
                if (_attrOfPage.attributes_group_id == -1) {
                    let interpretSpecialPage = listInterpretSpecialOfPage.filter(p => p.attributes_group_id == -1 && p.page_id == _page.page_id);

                    let data_selected_special = {};
                    for (let i = 0; i < interpretSpecialPage.length; i++) {
                        let item = interpretSpecialPage[i];
                        let { interpret_id, interpret_detail_id, showIndex } = item || {};
                        let _findParent = interpretSpecialPage.filter(p => p.interpret_id == interpret_id && !p.interpret_detail_id);
                        data_selected_special[interpret_id] = Object.assign({}, data_selected_special[interpret_id],
                            {
                                order_index: showIndex,
                                is_selected: (_findParent && _findParent.length > 0),
                                interpret_details: interpret_detail_id ? Object.assign({},
                                    data_selected_special[interpret_id] ? data_selected_special[interpret_id].interpret_details : {},
                                    {
                                        [interpret_detail_id]: {
                                            is_selected: true,
                                            order_index: showIndex
                                        }
                                    }) : {}
                            });
                    }
                    page_product.data_child.push(
                        {
                            attributes_group_id: _attrOfPage.attributes_group_id,
                            show_index: _attrOfPage.order_index,
                            data_interpret: [],
                            data_selected: [],
                            data_selected_special
                        }
                    )
                }
                else {//Luận giải thường
                    //Danh sách luận giải của chỉ số theo Page
                    let interpretPage = listInterpretPage.filter(p => p.page_id == _page.page_id && p.attributes_group_id == _attrOfPage.attributes_group_id) || [];
                    //Sap xep
                    interpretPage = _.orderBy(interpretPage, ['attributes_id', 'showIndex'], ['asc', 'asc']);
                    page_product.data_child.push(
                        {
                            attributes_group_id: _attrOfPage.attributes_group_id,
                            show_index: _attrOfPage.order_index,
                            data_interpret: [], // [...interpert],
                            data_selected: [...interpretPage]
                        }
                    )
                }
            }
            product_page.push(page_product);
        }

        if (product) {
            product.product_images = product_images || [];
            product.product_attributes = product_attributes;
            product.product_page = _.orderBy(product_page, ['order_index_page'], ['asc']);;

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
