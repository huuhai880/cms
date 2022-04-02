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
        const status = apiHelper.getValueFromObject(queryParams, 'status', 0);

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
        let id_card_place = apiHelper.getValueFromObject(bodyParams, 'id_card_place', null);
        let is_agree = apiHelper.getValueFromObject(bodyParams, 'is_agree', false);
        let is_active = apiHelper.getValueFromObject(bodyParams, 'is_active', true);
        let is_modify = apiHelper.getValueFromObject(bodyParams, 'is_modify', false);

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
            .input('IDCARDPLACE', id_card_place)
            .input('IDCARDBACKSIDE', id_card_back_side)
            .input('IDCARDFRONTSIDE', id_card_front_side)
            .input('LIVEIMAGE', live_image)
            .input('ISAGREE', is_agree)
            .input('ISACTIVE', is_active)
            .input('ISMODIFY', is_modify) //Neu Update
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

const getDetailAff = async (memberId) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('memberid', memberId)
            .execute('CRM_ACCOUNT_AFFILIATE_GetById_AdminWeb')
        return new ServiceResponse(true, '', affiliateClass.affDetail(res.recordset[0]))
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.getDetailAff',
        });
        return new ServiceResponse(false, error.message);
    }
}

const reviewAff = async (bodyParams = {}) => {
    try {
        let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id', null);
        let review_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let review_note = apiHelper.getValueFromObject(bodyParams, 'review_note', '');
        let status = apiHelper.getValueFromObject(bodyParams, 'status', 0);

        const pool = await mssql.pool;
        const rs = await pool.request()
            .input('MEMBERID', member_id)
            .input('STATUSAFFILIATE', status)
            .input('REVIEWNOTE', review_note)
            .input('REVIEWUSER', review_user)
            .execute('CRM_ACCOUNT_AFFILIATE_Review_AdminWeb')
        return new ServiceResponse(true, '', true)
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.reviewAff',
        });
        return new ServiceResponse(false, error.message);
    }
}

const upLevelAff = async (bodyParams = {}) => {
    try {
        let updated_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let member_up_level = apiHelper.getValueFromObject(bodyParams, 'member_up_level', []);
        if (member_up_level && member_up_level.length > 0) {
            const pool = await mssql.pool;
            await pool.request()
                .input('MEMBERIDS', member_up_level.join(","))
                .input('UPDATEDUSER', updated_user)
                .execute('CRM_ACCOUNT_AFFILIATE_UpLevel_AdminWeb')
        }
        return new ServiceResponse(true, '', true)
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.upLevelAff',
        });
        return new ServiceResponse(false, error.message);
    }
}

const infoAff = async (memberId) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('MEMBERID', memberId)
            .execute('CRM_ACCOUNT_AFFILIATE_Detail_AdminWeb')
        return new ServiceResponse(true, '', affiliateClass.infoAff(res.recordset[0]))
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.infoAff',
        });
        return new ServiceResponse(false, error.message);
    }
}

const reportOfAff = async (queryParams = {}) => {
    try {
        let member_id = apiHelper.getValueFromObject(queryParams, 'member_id', 0);
        let start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        let end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null);

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('MEMBERID', member_id)
            .input('FROMDATE', start_date)
            .input('TODATE', end_date)
            .execute('CRM_ACCOUNT_AFFILIATE_Report_AdminWeb');

        let {
            total_amount = 0,
            total_order = 0,
            total_commision = 0
        } = res.recordset[0] || {}

        return new ServiceResponse(true, '', {
            total_amount,
            total_order,
            total_commision
        })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.reportOfAff',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getListOrderAff = async (queryParams = {}) => {
    try {

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null);
        const member_id = apiHelper.getValueFromObject(queryParams, 'member_id', null);


        const pool = await mssql.pool;
        const res = await pool.request()
            .input('MEMBERID', member_id)
            .input('STARTDATE', start_date)
            .input('ENDDATE', end_date)
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .execute('CRM_ACCOUNT_AFFILIATE_Order_AdminWeb');

        let list = affiliateClass.listOrderAff(res.recordset);
        let total = apiHelper.getTotalData(res.recordset[0]);

        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.getListOrderAff',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getListCustomerAff = async (queryParams = {}) => {
    try {

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null);
        const member_id = apiHelper.getValueFromObject(queryParams, 'member_id', null);


        const pool = await mssql.pool;
        const res = await pool.request()
            .input('MEMBERID', member_id)
            .input('STARTDATE', start_date)
            .input('ENDDATE', end_date)
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .execute('CRM_ACCOUNT_AFFILIATE_Customer_AdminWeb');

        let list = affiliateClass.listCustomerAff(res.recordset);
        let total = apiHelper.getTotalData(res.recordset[0]);

        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.getListCustomerAff',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getListMemberAff = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null);
        const member_id = apiHelper.getValueFromObject(queryParams, 'member_id', null);

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('MEMBERID', member_id)
            .input('STARTDATE', start_date)
            .input('ENDDATE', end_date)
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .execute('CRM_ACCOUNT_AFFILIATE_Member_AdminWeb');

        let list = affiliateClass.listMemberAff(res.recordset);
        let total = apiHelper.getTotalData(res.recordset[0]);

        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.getListMemberAff',
        });
        return new ServiceResponse(false, error.message);
    }
}


const getListAffRequest = async (queryParams = {}) => {
    try {

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const start_date_register = apiHelper.getValueFromObject(queryParams, 'start_date_register', null);
        const end_date_register = apiHelper.getValueFromObject(queryParams, 'end_date_register', null);
        const start_date_approve = apiHelper.getValueFromObject(queryParams, 'start_date_approve', null);
        const end_date_approve = apiHelper.getValueFromObject(queryParams, 'end_date_approve', null);
        const status = apiHelper.getValueFromObject(queryParams, 'status', 0);

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('KEYWORD', keyword)
            .input('FROMDATEREGISTER', start_date_register)
            .input('TODATEREGISTER', end_date_register)
            .input('FROMDATEAPPROVE', start_date_approve)
            .input('TODATEAPPROVE', end_date_approve)
            .input('STATUS', status)
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .execute('AFF_AFFILIATEREQUEST_GetList_AdminWeb');
        let list = affiliateClass.listAffRequest(res.recordset);
        let total = apiHelper.getTotalData(res.recordset[0]);
        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.getListAffRequest',
        });
        return new ServiceResponse(false, error.message);
    }
}

const detailAffRequest = async (affRequestId) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('AFFILIATEREQUESTID', affRequestId)
            .execute('AFF_AFFILIATEREQUEST_GetById_AdminWeb')

        let affiliate_request = affiliateClass.detailAffRequest(res.recordsets[0][0] || {});
        let affiliate_types = affiliateClass.listAffiliateType(res.recordsets[1]);
        let policy_commisions = affiliateClass.listPolicyCommision(res.recordsets[2]);
        if (affiliate_request) {
            affiliate_request.policy_commision_apply = (res.recordsets[3] || []);
        }
        return new ServiceResponse(true, '', { affiliate_request, affiliate_types, policy_commisions })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.detailAffRequest',
        });
        return new ServiceResponse(false, error.message);
    }
}

const rejectAffRequest = async (bodyParams = {}) => {
    try {
        let review_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let review_note = apiHelper.getValueFromObject(bodyParams, 'review_note', null);
        let affiliate_request_id = apiHelper.getValueFromObject(bodyParams, 'affiliate_request_id', null);
        const pool = await mssql.pool;
        await pool.request()
            .input('AFFILIATEREQUESTID', affiliate_request_id)
            .input('REQUESTSTATUS', 4) //khong duyet
            .input('REVIEWNOTE', review_note)
            .input('REVIEWUSER', review_user)
            .execute('AFF_AFFILIATEREQUEST_Reject_AdminWeb')
        return new ServiceResponse(true, '', true)
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.rejectAffRequest',
        });
        return new ServiceResponse(false, error.message);
    }
}

const approveAffRequest = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        let review_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let review_note = apiHelper.getValueFromObject(bodyParams, 'review_note', null);
        let affiliate_request_id = apiHelper.getValueFromObject(bodyParams, 'affiliate_request_id', null);
        let policy_commision_apply = apiHelper.getValueFromObject(bodyParams, 'policy_commision_apply', []);
        let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id', null);

        //await transaction.begin();
        await new Promise(resolve => transaction.begin(resolve));

        const reqAffRq = new sql.Request(transaction);
        await reqAffRq
            .input('AFFILIATEREQUESTID', affiliate_request_id)
            .input('REQUESTSTATUS', 2) //Duyet
            .input('REVIEWNOTE', review_note)
            .input('REVIEWUSER', review_user)
            .execute('AFF_AFFILIATEREQUEST_Approve_AdminWeb');

        //Them AFFILIATE
        const reqAffiliate = new sql.Request(transaction);
        const resAffiliate = await reqAffiliate
            .input('AFFILIATEREQUESTID', affiliate_request_id)
            .input('CREATEDUSER', review_user)
            .execute('AFF_AFFILIATE_Create_AdminWeb');

        let { affiliate_id = null } = resAffiliate.recordset[0];
        if (!affiliate_id) {
            //await transaction.rollback();
            await new Promise(resolve => transaction.rollback(resolve));
            return new ServiceResponse(false, 'Lỗi thêm đối tác Affiliate');
        }

        //THEM CHINH SACH AFFiliate
        const reqAffPolicy = new sql.Request(transaction);
        await reqAffPolicy
            .input('MEMBERID', member_id)
            .input('POLICYCOMMISIONIDS', policy_commision_apply.map(p => p.value).join(","))
            .input('CREATEDUSER', review_user)
            .execute('AFF_POLICYCOMMISION_APPLY_CreateOrUpdate_AdminWeb')

        //CAP NHAT THONG TIN ACCOUNT
        const reqAccount = new sql.Request(transaction);
        await reqAccount
            .input('AFFILIATEREQUESTID', affiliate_request_id)
            .input('MEMBERID', member_id)
            .input('UPDATEDUSER', review_user)
            .execute('CRM_ACCOUNT_Update_FromAff_AdminWeb')

        //await transaction.commit();
        await new Promise(resolve => transaction.commit(resolve));
        return new ServiceResponse(true, '', true)
    } catch (error) {
        //await transaction.rollback();
        await new Promise(resolve => transaction.rollback(resolve));
        logger.error(error, {
            function: 'affiliate.service.approveAffRequest',
        });
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getOption,
    getListAffiliate,
    init,
    createAff,
    getDetailAff,
    reviewAff,
    upLevelAff,
    infoAff,
    reportOfAff,
    getListOrderAff,
    getListCustomerAff,
    getListMemberAff,
    getListAffRequest,
    detailAffRequest,
    rejectAffRequest,
    approveAffRequest
}