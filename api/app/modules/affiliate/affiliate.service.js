const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const affiliateClass = require('./affiliate.class');
const sql = require('mssql');
const events = require('../../common/events')
const htmlHelper = require('../../common/helpers/html.helper');
const config = require('../../../config/config');
const { saveImage } = require('../../common/helpers/saveFile.helper');

const getListAffiliate = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const is_active = apiHelper.getValueFromObject(queryParams, 'is_active', 2);
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null);
        const is_deleted = apiHelper.getValueFromObject(queryParams, 'is_deleted', 0);

        const affiliate_type = apiHelper.getValueFromObject(queryParams, 'affiliate_type', null);
        const policy_commision = apiHelper.getValueFromObject(queryParams, 'policy_commision', null);
        const status = apiHelper.getValueFromObject(queryParams, 'status', 2);

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('KEYWORD', keyword)
            .input('ISACTIVE', is_active)
            .input('ISDELETED', is_deleted)
            .input('STARTDATE', start_date)
            .input('ENDDATE', end_date)
            .input('AFFILIATETYPEID', affiliate_type)
            .input('POLICYCOMMISIONID', policy_commision)
            .input('STATUS', status)
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .execute('CRM_ACCOUNT_Affiliate_GetList_AdminWeb');

        let list = affiliateClass.list(res.recordsets[0]);
        let total = apiHelper.getTotalData(res.recordsets[0]);
        let total_not_review = apiHelper.getTotalData(res.recordsets[1]);

        return new ServiceResponse(true, "", { data: { list, total }, total_not_review })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.getListAffiliate',
        });
        return new ServiceResponse(false, error.message);
    }
}


const getOption = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute('AFF_AFFILIATE_GetOption_AdminWeb')
        let affiliate_type = res.recordsets[0];
        let policy_commision = res.recordsets[1];
        return new ServiceResponse(true, '', { affiliate_type, policy_commision })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.getOption',
        });
        return new ServiceResponse(false, error.message);
    }
}

const init = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute('CRM_ACCOUNT_Affiliate_Init_AdminWeb');
        let members = affiliateClass.listMember(res.recordsets[0]);
        let affiliate_types = affiliateClass.options(res.recordsets[1]);
        let aff_leaders = affiliateClass.options(res.recordsets[2]);
        let policy_commisions = affiliateClass.options(res.recordsets[3]);
        return new ServiceResponse(true, '', {
            members,
            aff_leaders,
            affiliate_types,
            policy_commisions
        })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.init',
        });
        return new ServiceResponse(false, error.message);
    }
}

const createAff = async (bodyParams = {}) => {
    try {
        let id_card_front_side = apiHelper.getValueFromObject(bodyParams, 'id_card_front_side', null);
        let id_card_back_side = apiHelper.getValueFromObject(bodyParams, 'id_card_back_side', null);
        let live_image = apiHelper.getValueFromObject(bodyParams, 'live_image');
        let folder = 'affiliate'
        if (id_card_front_side) {
            const path_id_card_front_side = await saveImage(folder, id_card_front_side);
            if (path_id_card_front_side) {
                id_card_front_side = path_id_card_front_side;
            }
        }
        if (id_card_back_side) {
            const path_id_card_back_side = await saveImage(folder, id_card_back_side);
            if (path_id_card_back_side) {
                id_card_back_side = path_id_card_back_side;
            }
        }
        if (live_image) {
            const path_live_image = await saveImage(folder, live_image);
            if (path_live_image) {
                live_image = path_live_image;
            }
        }
        let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id', null);
        let updated_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let affiliate_type_id = apiHelper.getValueFromObject(bodyParams, 'affiliate_type_id', null);
        let aff_leader_id = apiHelper.getValueFromObject(bodyParams, 'aff_leader_id', null);
        let phone_number = apiHelper.getValueFromObject(bodyParams, 'phone_number', null);
        let province_id = apiHelper.getValueFromObject(bodyParams, 'province_id', null);
        let district_id = apiHelper.getValueFromObject(bodyParams, 'district_id', null);
        let ward_id = apiHelper.getValueFromObject(bodyParams, 'ward_id', null);
        let address = apiHelper.getValueFromObject(bodyParams, 'address', null);
        let id_card = apiHelper.getValueFromObject(bodyParams, 'id_card', null);
        let id_card_date = apiHelper.getValueFromObject(bodyParams, 'id_card_date', null);
        let id_card_plate = apiHelper.getValueFromObject(bodyParams, 'id_card_plate', null);
        let is_agree = apiHelper.getValueFromObject(bodyParams, 'is_agree', false);
        let is_active = apiHelper.getValueFromObject(bodyParams, 'is_active', true);

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('MEMBERID', member_id)
            .input('AFFILIATETYPEID', affiliate_type_id)
            .input('AFFLEADERID', aff_leader_id)
            .input('PHONENUMBER', phone_number)
            .input('PROVINCEID', province_id)
            .input('DISTRICTID', district_id)
            .input('WARDID', ward_id)
            .input('ADDRESS', address)
            .input('IDCARD', id_card)
            .input('IDCARDDATE', id_card_date)
            .input('IDCARDPLATE', id_card_plate)
            .input('IDCARDBACKSIDE', id_card_back_side)
            .input('IDCARDFRONTSIDE', id_card_front_side)
            .input('LIVEIMAGE', live_image)
            .input('ISAGREE', is_agree)
            .input('ISACTIVE', is_active)
            .input('UPDATEDUSER', updated_user)
            .execute('CRM_ACCOUNT_AFFILIATE_Update_AdminWeb')

        return new ServiceResponse(true, '', true);
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.createAff',
        });
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getOption,
    getListAffiliate,
    init,
    createAff
}