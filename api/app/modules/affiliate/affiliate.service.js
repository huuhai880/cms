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
        const affiliate_type_id = apiHelper.getValueFromObject(queryParams, 'affiliate_type_id', null);

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('KEYWORD', keyword)
            .input('STARTDATE', start_date)
            .input('ENDDATE', end_date)
            .input('AFFILIATETYPEID', affiliate_type_id)
            .input('ISACTIVE', is_active)
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .execute('AFF_AFFILIATE_GetList_AdminWeb');

        let list = affiliateClass.listAffiliate(res.recordset);
        let total = apiHelper.getTotalData(res.recordset[0]);
        return new ServiceResponse(true, "", { list, total })
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
        const res = await pool.request()
            .execute('AFF_AFFILIATE_GetOption_AdminWeb')
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

const initDataOption = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .execute('AFF_AFFILIATE_GetDataSelect_AdminWeb');

        let members = affiliateClass.listMember(res.recordsets[0]);
        let affiliate_types = affiliateClass.listAffiliateType(res.recordsets[1]);
        affiliate_types = (affiliate_types || []).map(p => {
            return {
                ...p,
                label: p.affiliate_type_name,
                value: p.affiliate_type_id
            }
        })
        let aff_leaders = affiliateClass.options(res.recordsets[2]);
        let policy_commisions = affiliateClass.listPolicyCommision(res.recordsets[3]);
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

const createOrUpdateAff = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
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
            else {
                return new ServiceResponse(false, 'Vui lòng upload ảnh < 4MB.');
            }
        }
        if (id_card_back_side) {
            const path_id_card_back_side = await saveImage(folder, id_card_back_side);
            if (path_id_card_back_side) {
                id_card_back_side = path_id_card_back_side;
            }
            else {
                return new ServiceResponse(false, 'Vui lòng upload ảnh < 4MB.');
            }
        }
        if (live_image) {
            const path_live_image = await saveImage(folder, live_image);
            if (path_live_image) {
                live_image = path_live_image;
            }
            else {
                return new ServiceResponse(false, 'Vui lòng upload ảnh < 4MB.');
            }
        }
        let affiliate_id = apiHelper.getValueFromObject(bodyParams, 'affiliate_id', null);
        let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id', null);
        let created_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let affiliate_type_id = apiHelper.getValueFromObject(bodyParams, 'affiliate_type_id', null);
        let affiliate_leader_id = apiHelper.getValueFromObject(bodyParams, 'affiliate_leader_id', null);
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
        let policy_commision_apply = apiHelper.getValueFromObject(bodyParams, 'policy_commision_apply', []);

        //await transaction.begin();
        await new Promise(resolve => transaction.begin(resolve));

        //CẬP NHẬT THÔNG TIN ĐỐI TÁC
        const reqAffiliate = new sql.Request(transaction);
        const resAffiliate = await reqAffiliate
            .input('AFFILIATEID', affiliate_id)
            .input('MEMBERID', member_id)
            .input('AFFILIATETYPEID', affiliate_type_id)
            .input('AFFILIATELEADERID', affiliate_leader_id)
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
            .input('CREATEDUSER', created_user)
            .execute('AFF_AFFILIATE_CreateOrUpdate_AdminWeb')

        let { RESULT } = resAffiliate.recordset[0];
        if (!RESULT) {

            await new Promise(resolve => transaction.rollback(resolve));
            return new ServiceResponse(false, `Lỗi ${affiliate_id ? 'cập nhật' : 'thêm mới'} thông tin đối tác.`)
        }

        //CẬP NHẬT THÔNG TIN ACCOUNT
        const reqAccount = new sql.Request(transaction);
        await reqAccount
            .input('MEMBERID', member_id)
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
            .input('UPDATEDUSER', created_user)
            .execute('CRM_ACCOUNT_UpdateByAffiliate_AdminWeb')

        //CẬP NHẬT THÔNG TIN NẾU LÀ LEADER
        const reqAffRelationship = new sql.Request(transaction);
        await reqAffRelationship
            .input('AFFILIATETYPEID', affiliate_type_id)
            .input('MEMBERID', member_id)
            .input('AFFILIATELEADERID', affiliate_leader_id)
            .execute('AFF_RELATIONSHIPS_Create_AdminWeb')

        //CÂP NHẬT THÔNG TIN CHÍNH SÁCH
        const reqAffPolicy = new sql.Request(transaction);
        await reqAffPolicy
            .input('MEMBERID', member_id)
            .input('POLICYCOMMISIONIDS', policy_commision_apply.map(p => p.value).join(","))
            .input('CREATEDUSER', created_user)
            .execute('AFF_POLICYCOMMISION_APPLY_CreateOrUpdate_AdminWeb')


        //await transaction.commit();
        await new Promise(resolve => transaction.commit(resolve));

        return new ServiceResponse(true, '', RESULT);
    } catch (error) {
        console.log({ error })
        //await transaction.rollback();
        await new Promise(resolve => transaction.rollback(resolve));
        logger.error(error, {
            function: 'affiliate.service.createOrUpdateAff',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getDetailAffiliate = async (affiliateId) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('AFFILIATEID', affiliateId)
            .execute('AFF_AFFILIATE_GetById_AdminWeb')

        let affiliate = affiliateClass.affiliateDetail(res.recordsets[0][0]);
        if (affiliate) {
            affiliate.policy_commision_apply = res.recordsets[1];
            let { affiliate_leader_id = null } = res.recordsets[2][0] || {};
            affiliate.affiliate_leader_id = affiliate_leader_id;
        }
        return new ServiceResponse(true, '', affiliate)
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.getDetailAffiliate',
        });
        return new ServiceResponse(false, error.message);
    }
}


const upLevelAffiliate = async (bodyParams = {}) => {
    try {
        let updated_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let member_up_level = apiHelper.getValueFromObject(bodyParams, 'member_up_level', []);
        if (member_up_level && member_up_level.length > 0) {
            const pool = await mssql.pool;
            await pool.request()
                .input('MEMBERIDS', member_up_level.join(","))
                .input('UPDATEDUSER', updated_user)
                .execute('AFF_AFFILIATE_UpLevel_AdminWeb')
        }
        return new ServiceResponse(true, '', true)
    } catch (error) {
        console.log({ error })
        logger.error(error, {
            function: 'affiliate.service.upLevelAffiliate',
        });
        return new ServiceResponse(false, error.message);
    }
}


const reportOfAffiliate = async (queryParams = {}) => {
    try {
        let member_id = apiHelper.getValueFromObject(queryParams, 'member_id', 0);
        let month = apiHelper.getValueFromObject(queryParams, 'month', null);

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('MEMBERID', member_id)
            .input('MONTH', month)
            .execute('AFF_AFFILIATE_Report_AdminWeb');

        return new ServiceResponse(true, '', affiliateClass.reportAffiliate(res.recordset[0]))
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.reportOfAffiliate',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getDataOfAffiliate = async (queryParams = {}) => {
    try {

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const month = apiHelper.getValueFromObject(queryParams, 'month', null);
        const member_id = apiHelper.getValueFromObject(queryParams, 'member_id', null);
        const type = apiHelper.getValueFromObject(queryParams, 'type', 'order');

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('MEMBERID', member_id)
            .input('MONTH', month)
            .input('TYPE', type)
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .execute('AFF_AFFILIATE_OrderCustomerMember_AdminWeb');

        let list = [];
        if (type == 'order') {
            list = affiliateClass.listOrderAff(res.recordset);
        }
        else if (type == 'customer') {
            list = affiliateClass.listCustomerAff(res.recordset);
        }
        else if (type == 'member') {
            list = affiliateClass.listMemberAff(res.recordset);
        }
        let total = apiHelper.getTotalData(res.recordset[0]);

        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.getListOrderCustomerMember',
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

const getDetailAffRequest = async (affRequestId) => {
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
            function: 'affiliate.service.getDetailAffRequest',
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

        //TAO VI CHO AFF
        const reqWalet = new sql.Request(transaction);
        await reqWalet
            .input('MEMBERID', member_id)
            .input('CREATEDUSER', review_user)
            .execute('WA_WALET_Create_AdminWeb')

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

const updStatusAff = async (bodyParams = {}) => {
    try {
        let updated_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let is_active = apiHelper.getValueFromObject(bodyParams, 'is_active', 0);
        let affiliate_id = apiHelper.getValueFromObject(bodyParams, 'affiliate_id', null);

        const pool = await mssql.pool;
        await pool.request()
            .input('AFFILIATEID', affiliate_id)
            .input('ISACTIVE', is_active)
            .input('UPDATEDUSER', updated_user)
            .execute('AFF_AFFILIATE_UpdateStatus_AdminWeb')

        return new ServiceResponse(true, '', true)
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.updStatus',
        });
        return new ServiceResponse(false, error.message);
    }
}

const updPolicyCommisionApply = async (bodyParams = {}) => {
    try {
        let policy_commision_apply = apiHelper.getValueFromObject(bodyParams, 'policy_commision_apply', []);
        let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id', null);
        let updated_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');

        const pool = await mssql.pool;
        await pool.request()
            .input('MEMBERID', member_id)
            .input('POLICYCOMMISIONIDS', policy_commision_apply.map(p => p.value).join(","))
            .input('CREATEDUSER', updated_user)
            .execute('AFF_POLICYCOMMISION_APPLY_CreateOrUpdate_AdminWeb')

        return new ServiceResponse(true, '', true)
    } catch (error) {
        logger.error(error, {
            function: 'affiliate.service.updPolicyCommisionApply',
        });
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getOption,
    getListAffiliate,
    initDataOption,
    createOrUpdateAff,
    getDetailAffiliate,
    upLevelAffiliate,
    reportOfAffiliate,
    getDataOfAffiliate,
    getListAffRequest,
    getDetailAffRequest,
    rejectAffRequest,
    approveAffRequest,
    updStatusAff,
    updPolicyCommisionApply
}