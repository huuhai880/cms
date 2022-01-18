const ProductPageClass = require('./product-page.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');

const getListProductPage = async () => { // get list product page
    try {

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('MD_PAGE_GetListPage_AdminWeb');
        const result = data.recordset;
        return new ServiceResponse(true, '', {
            data: ProductPageClass.list(result),
        });
    } catch (e) {
        logger.error(e, {
            function: 'product-page.service.getListProductPage',
        });

        return new ServiceResponse(true, '', {});
    }
};

const getListInterPretPageProduct = async (queryParams) => { // get interpret
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input(
                'ATTRIBUTESGROUPID',
                queryParams
            )
            .execute('MD_PRODUCT_PAGE_GetListInterPret_AdminWeb');
        const result = data.recordset;
        return new ServiceResponse(true, '', {
            data: ProductPageClass.list_interpretdetail(result),
        });
    } catch (e) {
        logger.error(e, {
            function: 'product-page.service.getListInterPretPageProduct',
        });

        return new ServiceResponse(true, '', {});
    }
};


const getListInterpretSpecial = async () => {
    try {

        const pool = await mssql.pool;
        const res = await pool.request()
            .execute('FOR_INTERPRET_GetListSpecial_AdminWeb');

        let listInterpretSpecial = ProductPageClass.listInterpretSpecial(res.recordsets[0]);
        let listInterpretSpecialDetail = ProductPageClass.listInterpretSpecialDetail(res.recordsets[1]);
        let listInterpretSpecialDetailAttributes = ProductPageClass.listInterpretSpecialAttributes(res.recordsets[2]);


        for (let i = 0; i < listInterpretSpecial.length; i++) {
            let _interpret = listInterpretSpecial[i];
            let interpret_details = listInterpretSpecialDetail.filter(p => p.interpret_id == _interpret.interpret_id)
                .map(p => { return { ...p, ...{ is_selected: false } } });

            _interpret.interpret_details = interpret_details || [];
            let listAttr = listInterpretSpecialDetailAttributes.filter(p => p.interpret_id == _interpret.interpret_id);
            _interpret.interpret_view_name = (listAttr || []).map(p => p.attributes_name).join(";");
            _interpret.is_selected = false;
        }

        return new ServiceResponse(true, '', listInterpretSpecial);
    } catch (error) {
        logger.error(e, {
            function: 'product-page.service.getListInterpretSpecial',
        });

        return new ServiceResponse(true, '', {});
    }
}


module.exports = {
    getListProductPage,
    getListInterPretPageProduct,
    getListInterpretSpecial
};
