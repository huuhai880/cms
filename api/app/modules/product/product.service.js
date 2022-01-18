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
            .input(
                'LINKLANDINGPAGE',
                apiHelper.getValueFromObject(bodyParams, 'link_landing_page', null)
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
            let listProductAttributes = []; //Insert
            for (let k = 0; k < product_attributes.length; k++) {
                let attr = product_attributes[k];
                let { interprets = [] } = attr || {};
                //Chỉ lấy luận giải cha được chọn của Chỉ số đang xét
                interprets = (interprets.filter(p => p.is_selected) || [])
                if (interprets && interprets.length > 0) {
                    interprets.forEach(interpret => {
                        let { interpret_id = 0,
                            is_show_search_result = false,
                            text_url = null,
                            url = null,
                            interpret_details = []
                        } = interpret || {};

                        listProductAttributes.push({
                            product_attribute_id: 0,
                            product_id,
                            attributes_group_id: attr.attributes_group_id,
                            interpret_id,
                            interpret_detail_id: 0,
                            is_show_search_result,
                            text_url,
                            url,
                            order_index: k
                        })

                        //Chỉ lấy luận giải con của Luận giải cha chỉ được chọn
                        interpret_details = (interpret_details.filter(p => p.is_selected) || [])
                        interpret_details.forEach(detail => {
                            let {
                                interpret_detail_id = 0,
                                is_show_search_result = false,
                                text_url = null,
                                url = null,
                            } = detail || {};

                            listProductAttributes.push({
                                product_attribute_id: 0,
                                product_id,
                                attributes_group_id: attr.attributes_group_id,
                                interpret_id: interpret.interpret_id,
                                interpret_detail_id,
                                is_show_search_result,
                                text_url,
                                url,
                                order_index: k
                            })
                        })
                    })
                }
                else { //Nếu không có luận giải thì vẫn Insert Chỉ số
                    listProductAttributes.push({
                        product_attribute_id: 0,
                        product_id,
                        attributes_group_id: attr.attributes_group_id,
                        interpret_id: 0,
                        interpret_detail_id: 0,
                        is_show_search_result: false,
                        text_url: null,
                        url: null,
                        order_index: k
                    })
                }
            };


            if (listProductAttributes && listProductAttributes.length > 0) {
                const reqAttribute = new sql.Request(transaction);
                //Insert Chi so cho san pham
                for (let i = 0; i < listProductAttributes.length; i++) {
                    let attributesGroup = listProductAttributes[i];
                    await reqAttribute
                        .input('PROATTRIBUTESID', attributesGroup.product_attribute_id)
                        .input('PRODUCTID', product_id)
                        .input('ATTRIBUTESGROUPID', attributesGroup.attributes_group_id)
                        .input('INTERPRETID', attributesGroup.interpret_id)
                        .input('INTERPRETDETAILID', attributesGroup.interpret_detail_id)
                        .input('ISSHOWSEARCHRESULT', attributesGroup.is_show_search_result)
                        .input('TEXTURL', attributesGroup.text_url)
                        .input('URL', attributesGroup.url)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
                        .input('ORDERINDEX', attributesGroup.order_index)
                        .execute('MD_PRODUCT_ATTRIBUTES_Create_AdminWeb');
                }
            }
        }

        // tạo product page
        let product_page = apiHelper.getValueFromObject(
            bodyParams,
            'product_page',
            []
        );

        if (product_page && product_page.length > 0) {
            const reqProductPage = new sql.Request(transaction);
            for (let i = 0; i < product_page.length; i++) {
                const data_child = product_page[i].data_child;
                for (let j = 0; j < data_child.length; j++) {
                    if (data_child[j].attributes_group_id == -1) { //Nếu là luận giải đặc biệt
                        let _interpretSpecialSelecteds = [];
                        let { data_interpret = [] } = data_child[j] || {};

                        //Lấy luận giải cha có selected
                        for (let t = 0; t < data_interpret.length; t++) {
                            let _interpretSpecial = data_interpret[t];
                            if (_interpretSpecial.is_selected) {
                                _interpretSpecial.interpret_detail_id = null;
                                _interpretSpecialSelecteds.push(_interpretSpecial);
                            }
                            let { interpret_details = [] } = _interpretSpecial || {};
                            if (interpret_details.length > 0) {
                                //Lấy luận giải con có selected
                                for (let r = 0; r < interpret_details.length; r++) {
                                    let _childInterpret = interpret_details[r];
                                    if (_childInterpret.is_selected) {
                                        _interpretSpecialSelecteds.push(_childInterpret)
                                    }
                                }
                            }
                        }

                        //Thêm luận giải vào Page
                        for (let m = 0; m < _interpretSpecialSelecteds.length; m++) {
                            await reqProductPage
                                .input('PRODUCTPAGEID', product_page[i].id_product_page)
                                .input('PRODUCTID', product_id)
                                .input('PAGEID', product_page[i].product_page_id)
                                .input('ATTRIBUTESGROUPID', -1)
                                .input('ATTRIBUTEID', -1)
                                .input('INTERPRETID', _interpretSpecialSelecteds[m].interpret_id)
                                .input('INTERPRETDETAILID', _interpretSpecialSelecteds[m].interpret_detail_id)
                                .input('ORDERINDEX', data_child[j].show_index)
                                .input('ORDERINDEXINTERPRET', _interpretSpecialSelecteds[m].order_index)
                                .input('CREATEDUSER', apiHelper.getValueFromObject(
                                    bodyParams,
                                    'auth_name',
                                    'administrator'
                                ))
                                .input('ISINTERPRETSPECIAL', true)
                                .execute('MD_PRODUCT_PAGE_CreateOrUpdate_AdminWeb');
                        }

                    }
                    else {//Nếu không phải là luận giải đặc biệt thì như cũ
                        const data_selected = data_child[j].data_selected;
                        for (let k = 0; k < data_selected.length; k++) {
                            await reqProductPage
                                .input('PRODUCTPAGEID', product_page[i].id_product_page)
                                .input('PRODUCTID', product_id)
                                .input('PAGEID', product_page[i].product_page_id)
                                .input('ATTRIBUTESGROUPID', data_selected[k].attributes_group_id)
                                .input('ATTRIBUTEID', data_selected[k].attributes_id)
                                .input('INTERPRETID', data_selected[k].interpret_id)
                                .input('INTERPRETDETAILID', data_selected[k].interpret_detail_id)
                                .input('ORDERINDEX', data_child[j].show_index)
                                .input('ORDERINDEXINTERPRET', data_selected[k].showIndex)
                                .input('CREATEDUSER', apiHelper.getValueFromObject(
                                    bodyParams,
                                    'auth_name',
                                    'administrator'
                                ))
                                .input('ISINTERPRETSPECIAL', false)
                                .execute('MD_PRODUCT_PAGE_CreateOrUpdate_AdminWeb');
                        }
                    }
                }
            }
        }
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
            .input(
                'LINKLANDINGPAGE',
                apiHelper.getValueFromObject(bodyParams, 'link_landing_page', null)
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
            let listProductAttributes = []; //Insert
            for (let k = 0; k < product_attributes.length; k++) {
                let attr = product_attributes[k];
                let { interprets = [] } = attr || {};
                //Chỉ lấy luận giải cha được chọn của Chỉ số đang xét
                interprets = (interprets.filter(p => p.is_selected) || [])
                if (interprets && interprets.length > 0) {
                    interprets.forEach(interpret => {
                        let { interpret_id = 0,
                            is_show_search_result = false,
                            text_url = null,
                            url = null,
                            interpret_details = [],
                            product_attribute_id = 0
                        } = interpret || {};

                        listProductAttributes.push({
                            product_attribute_id,
                            product_id,
                            attributes_group_id: attr.attributes_group_id,
                            interpret_id,
                            interpret_detail_id: 0,
                            is_show_search_result,
                            text_url,
                            url,
                            order_index: k
                        })

                        //Chỉ lấy luận giải con của Luận giải cha chỉ được chọn
                        interpret_details = (interpret_details.filter(p => p.is_selected) || [])
                        interpret_details.forEach(detail => {
                            let {
                                interpret_detail_id = 0,
                                is_show_search_result = false,
                                text_url = null,
                                url = null,
                                product_attribute_id = 0
                            } = detail || {};

                            listProductAttributes.push({
                                product_attribute_id,
                                product_id,
                                attributes_group_id: attr.attributes_group_id,
                                interpret_id: interpret.interpret_id,
                                interpret_detail_id,
                                is_show_search_result,
                                text_url,
                                url,
                                order_index: k
                            })
                        })
                    })
                }
                else { //Nếu không có luận giải thì vẫn Insert Chỉ số
                    listProductAttributes.push({
                        product_attribute_id: 0,
                        product_id,
                        attributes_group_id: attr.attributes_group_id,
                        interpret_id: 0,
                        interpret_detail_id: 0,
                        is_show_search_result: false,
                        text_url: null,
                        url: null,
                        order_index: k
                    })
                }
            };

            if (listProductAttributes && listProductAttributes.length > 0) {
                const reqAttribute = new sql.Request(transaction);
                //Insert Chi so cho san pham
                for (let i = 0; i < listProductAttributes.length; i++) {
                    let attributesGroup = listProductAttributes[i];
                    await reqAttribute
                        .input('PROATTRIBUTESID', attributesGroup.product_attribute_id)
                        .input('PRODUCTID', product_id)
                        .input('ATTRIBUTESGROUPID', attributesGroup.attributes_group_id)
                        .input('INTERPRETID', attributesGroup.interpret_id)
                        .input('INTERPRETDETAILID', attributesGroup.interpret_detail_id)
                        .input('ISSHOWSEARCHRESULT', attributesGroup.is_show_search_result)
                        .input('TEXTURL', attributesGroup.text_url)
                        .input('URL', attributesGroup.url)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
                        .input('ORDERINDEX', attributesGroup.order_index)
                        .execute('MD_PRODUCT_ATTRIBUTES_Create_AdminWeb');
                }
            }

        }

        // ---- update product page ---
        let product_page = apiHelper.getValueFromObject(
            bodyParams,
            'product_page',
            []
        );
        const reqDelPageProduct = new sql.Request(transaction);
        await reqDelPageProduct
            .input('PRODUCTID', product_id)
            .input(
                'DELETEDUSER',
                apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator')
            )
            .execute('MD_PRODUCT_PAGE_DeleteProductPage_AdminWeb');

        if (product_page && product_page.length > 0) {
            const reqProductPage = new sql.Request(transaction);
            for (let i = 0; i < product_page.length; i++) {
                const data_child = product_page[i].data_child;
                for (let j = 0; j < data_child.length; j++) {
                    if (data_child[j].attributes_group_id == -1) { //Nếu là luận giải đặc biệt
                        let _interpretSpecialSelecteds = [];
                        let { data_interpret = [] } = data_child[j] || {};
                        //Lấy luận giải cha có selected
                        for (let t = 0; t < data_interpret.length; t++) {
                            let _interpretSpecial = data_interpret[t];
                            if (_interpretSpecial.is_selected) {
                                _interpretSpecial.interpret_detail_id = null;
                                _interpretSpecialSelecteds.push(_interpretSpecial);
                            }
                            let { interpret_details = [] } = _interpretSpecial || {};
                            if (interpret_details.length > 0) {
                                //Lấy luận giải con có selected
                                for (let r = 0; r < interpret_details.length; r++) {
                                    let _childInterpret = interpret_details[r];
                                    if (_childInterpret.is_selected) {
                                        _interpretSpecialSelecteds.push(_childInterpret)
                                    }
                                }
                            }
                        }

                        //Thêm luận giải vào Page
                        for (let m = 0; m < _interpretSpecialSelecteds.length; m++) {
                            await reqProductPage
                                .input('PRODUCTPAGEID', product_page[i].id_product_page)
                                .input('PRODUCTID', product_id)
                                .input('PAGEID', product_page[i].product_page_id)
                                .input('ATTRIBUTESGROUPID', -1)
                                .input('ATTRIBUTEID', -1)
                                .input('INTERPRETID', _interpretSpecialSelecteds[m].interpret_id)
                                .input('INTERPRETDETAILID', _interpretSpecialSelecteds[m].interpret_detail_id)
                                .input('ORDERINDEX', data_child[j].show_index)
                                .input('ORDERINDEXINTERPRET', _interpretSpecialSelecteds[m].order_index)
                                .input('CREATEDUSER', apiHelper.getValueFromObject(
                                    bodyParams,
                                    'auth_name',
                                    'administrator'
                                ))
                                .input('ISINTERPRETSPECIAL', true)
                                .execute('MD_PRODUCT_PAGE_CreateOrUpdate_AdminWeb');
                        }
                    }
                    else {//Nếu không phải là luận giải đặc biệt thì như cũ
                        const data_selected = data_child[j].data_selected;
                        for (let k = 0; k < data_selected.length; k++) {
                            await reqProductPage
                                .input('PRODUCTPAGEID', data_selected[k].product_page_id)
                                .input('PRODUCTID', product_id)
                                .input('PAGEID', product_page[i].product_page_id)
                                .input('ATTRIBUTESGROUPID', data_selected[k].attributes_group_id)
                                .input('ATTRIBUTEID', data_selected[k].attributes_id)
                                .input('INTERPRETID', data_selected[k].interpret_id)
                                .input('INTERPRETDETAILID', data_selected[k].interpret_detail_id)
                                .input('ORDERINDEX', data_child[j].show_index)
                                .input('ORDERINDEXINTERPRET', data_selected[k].showIndex)
                                .input('CREATEDUSER', apiHelper.getValueFromObject(
                                    bodyParams,
                                    'auth_name',
                                    'administrator'
                                ))
                                .input('ISINTERPRETSPECIAL', false)
                                .execute('MD_PRODUCT_PAGE_CreateOrUpdate_AdminWeb');
                        }
                    }
                }
            }
        }


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

        // let product_attributes = [];
        // if (attributes && attributes.length > 0) {
        //     for (let index = 0; index < attributes.length; index++) {
        //         const attr = attributes[index];
        //         let { attributes_group_id, product_id } = attr || {};
        //         product_attributes.push({
        //             attributes_group_id,
        //             product_id,
        //         });
        //     }
        // }


        // for (let index = 0; index < product_attributes.length; index++) {
        //     const element = product_attributes[index];
        //     const res = await pool
        //         .request()
        //         .input(
        //             'ATTRIBUTESGROUPID',
        //             apiHelper.getValueFromObject(element, 'attributes_group_id', null)
        //         )
        //         .input(
        //             'PRODUCTID',
        //             apiHelper.getValueFromObject(element, 'product_id', null)
        //         )
        //         .execute('FOR_Interpret_GetListInterpretbyAttributesGruopId_AdminWeb');
        //     let listInterpret = productClass.listInterpret(res.recordsets[1]);

        //     if (listInterpret && listInterpret.length > 0) {
        //         let interPretIds = listInterpret
        //             .map((item) => item.interpret_id)
        //             .join(',');
        //         const resDetail = await pool
        //             .request()
        //             .input('INTERPRETIDS', interPretIds)
        //             .input(
        //                 'PRODUCTID',
        //                 apiHelper.getValueFromObject(element, 'product_id', null)
        //             )
        //             .execute('FOR_INTERPRETDETAIL_GetListByIds_AdminWeb');
        //         let listInterPretDetail =
        //             productClass.listInterpretDetail(resDetail.recordsets[1]) || [];
        //         for (let index = 0; index < listInterpret.length; index++) {
        //             let interpret = listInterpret[index];
        //             let interpret_details = listInterPretDetail.filter(
        //                 (x) => x.interpret_id == interpret.interpret_id
        //             );
        //             interpret.interpret_details = interpret_details || [];
        //         }
        //         product_attributes[index].interprets = listInterpret;
        //     }
        // }

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
                let interprets = listInterpretAll.filter(p => p.attributes_group_id == attributes_group_id)|| [];

                interprets = _.orderBy(interprets, ['date_sort'], ['desc']);;

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


        // // get detail product page
        // let product_page = [];
        // const product_page_detail = await pool
        //     .request()
        //     .input(
        //         'PRODUCTID',
        //         product_id
        //     )
        //     .execute('MD_PRODUCT_PAGE_GetListPage_AdminWeb');
        // const result_page = productClass.list_page_product(product_page_detail.recordset);

        // // data child
        // for (let i = 0; i < result_page.length; i++) {
        //     let page_product = {
        //         product_page_id: result_page[i].page_id,
        //         title_page: result_page[i].title_page,
        //         data_child: []
        //     }
        //     const att_group_detail = await pool
        //         .request()
        //         .input('PRODUCTID', product_id)
        //         .input('PAGEID', result_page[i].page_id)
        //         .execute('MD_PRODUCT_PAGE_GetAttGroup_AdminWeb');

        //     const result_AttGroup_Page = productClass.listAttGroupProductPage(att_group_detail.recordset);
        //     for (let j = 0; j < result_AttGroup_Page.length; j++) {
        //         const interpert_detail = await pool
        //             .request()
        //             .input('PRODUCTID', product_id)
        //             .input('PAGEID', result_page[i].page_id)
        //             .input('ATTRIBUTESGROUPID', result_AttGroup_Page[j].attributes_group_id)
        //             .execute('MD_PRODUCT_PAGE_GetIntePertDetail_AdminWeb');
        //         const interpert_page = productClass.listInterPertPage(interpert_detail.recordset);

        //         const interpert_list = await pool
        //             .request()
        //             .input('ATTRIBUTESGROUPID', result_AttGroup_Page[j].attributes_group_id)
        //             .execute('MD_PRODUCT_PAGE_GetListInterPret_AdminWeb');
        //         const interpert = productClass.listInterPertPage(interpert_list.recordset);
        //         page_product.data_child.push(
        //             {
        //                 attributes_group_id: result_AttGroup_Page[j].attributes_group_id,
        //                 show_index: result_AttGroup_Page[j].order_index,
        //                 data_interpret: [...interpert],
        //                 data_selected: [...interpert_page],
        //             }
        //         )
        //     }

        //     product_page.push(page_product);
        // }

        //Lấy dữ liệu V2
        const resV2 = await pool.request()
            .input('productid', product_id)
            .execute('MD_PRODUCT_PAGE_GetData_AdminWeb')

        let listPage = productClass.list_page_product(resV2.recordsets[0]);
        let listAttributesGroup = productClass.listAttGroupProductPage(resV2.recordsets[1]);
        let listInterpretPage = productClass.listInterPertPage(resV2.recordsets[2]);
        let listInterpret = productClass.listInterPertPage(resV2.recordsets[3]);
        let listInterpretSpecialOfPage = productClass.listInterpretSpecialOfPage(resV2.recordsets[4]);

        //Lấy danh sách luận giải đặc biệt nếu có
        let product_page = [];
        let _interpretSpecial = [];
        if (listAttributesGroup.find(p => p.attributes_group_id == -1)) {
            _interpretSpecial = (await productPageService.getListInterpretSpecial()).getData();
        }

        for (let i = 0; i < listPage.length; i++) {
            let _page = listPage[i];
            let page_product = {
                product_page_id: _page.page_id,
                title_page: _page.page_name,
                data_child: []
            }

            let __interpretSpecialClone = JSON.parse(JSON.stringify([..._interpretSpecial]));
            let attributesGroupOfPage = listAttributesGroup.filter(p => p.page_id == _page.page_id);

            for (let y = 0; y < attributesGroupOfPage.length; y++) {
                let _attrOfPage = attributesGroupOfPage[y];

                //Luận giải đặc biệt
                if (_attrOfPage.attributes_group_id == -1) {
                    let interpretSpecialPage = listInterpretSpecialOfPage.filter(p => p.attributes_group_id == -1 && p.page_id == _page.page_id);
                    __interpretSpecialClone = __interpretSpecialClone.map(item => {
                        return {
                            ...item,
                            is_selected: interpretSpecialPage.find(p => p.interpret_id == item.interpret_id && p.page_id == _page.page_id) ? true : false,
                            interpret_details: item.interpret_details.map(_detail => {
                                return {
                                    ..._detail,
                                    is_selected: interpretSpecialPage.find(p => p.interpret_id == item.interpret_id
                                        && p.interpret_detail_id == _detail.interpret_detail_id && p.page_id == _page.page_id) ? true : false

                                }

                            })
                        }
                    })

                    // for (let k = 0; k < __interpretSpecialClone.length; k++) {
                    //     let item = __interpretSpecialClone[k];
                    //     let _find = interpretSpecialPage.find(p => p.interpret_id == item.interpret_id && p.page_id == _page.page_id);
                    //     if (_find) {
                    //         item.is_selected = true
                    //     }
                    //     else {
                    //         item.is_selected = false
                    //     };
                    //     if (item.interpret_details.length > 0) {
                    //         for (let l = 0; l < item.interpret_details.length; l++) {
                    //             let _detail = item.interpret_details[l];
                    //             let _findDetail = interpretSpecialPage.find(p => p.interpret_id == item.interpret_id
                    //                 && p.interpret_detail_id == _detail.interpret_detail_id && p.page_id == _page.page_id);
                    //             if (_findDetail) {
                    //                 _detail.is_selected = true
                    //             }
                    //             else {
                    //                 _detail.is_selected = false
                    //             }
                    //         }
                    //     }
                    // }

                    page_product.data_child.push(
                        {
                            attributes_group_id: _attrOfPage.attributes_group_id,
                            show_index: _attrOfPage.order_index,
                            data_interpret: [...__interpretSpecialClone],
                            data_selected: []
                        }
                    )
                }
                else {//Luận giải thường
                    //Danh sách luận giải chi tiết theo Chỉ số
                    let interpert = listInterpret.filter(p => p.attributes_group_id == _attrOfPage.attributes_group_id);
                    //Danh sách luận giải của chỉ số theo Page
                    let interpretPage = listInterpretPage.filter(p => p.page_id == _page.page_id && p.attributes_group_id == _attrOfPage.attributes_group_id) || [];
                    //Sap xep
                    interpretPage = _.orderBy(interpretPage, ['attributes_id', 'showIndex'], ['asc', 'asc']);
                    page_product.data_child.push(
                        {
                            attributes_group_id: _attrOfPage.attributes_group_id,
                            show_index: _attrOfPage.order_index,
                            data_interpret: [...interpert],
                            data_selected: [...interpretPage]
                        }
                    )
                }
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
