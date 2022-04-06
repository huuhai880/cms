const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const policyCommisionClass = require('./policy-commision.class');
const sql = require('mssql');
const events = require('../../common/events')
const htmlHelper = require('../../common/helpers/html.helper');
const config = require('../../../config/config');
const { saveImage } = require('../../common/helpers/saveFile.helper');

const getListPolicyCommision = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const is_active = apiHelper.getValueFromObject(queryParams, 'is_active', 1);
        const is_deleted = apiHelper.getValueFromObject(queryParams, 'is_deleted', 0);
        const affiliate_type_id = apiHelper.getValueFromObject(queryParams, 'affiliate_type_id', null);

        const pool = await mssql.pool;
        const res = await pool.request()
            .input('KEYWORD', keyword)
            .input('AFFILIATETYPEID', affiliate_type_id)
            .input('ISACTIVE', is_active)
            .input('ISDELETED', is_deleted)
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .execute('AFF_POLICYCOMMISION_GetList_AdminWeb');

        let list = policyCommisionClass.list(res.recordset);
        let total = apiHelper.getTotalData(res.recordset[0]);
        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'policy-commision.service.getListPolicyCommision',
        });
        return new ServiceResponse(false, error.message);
    }
}

const deletePolicyCommision = async (bodyParams = {}) => {
    try {
        let policy_commision_id = apiHelper.getValueFromObject(bodyParams, 'id', null);
        let deleted_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        const pool = await mssql.pool;
        await pool.request()
            .input('POLICYCOMMISIONID', policy_commision_id)
            .input('DELETEDUSER', deleted_user)
            .execute('AFF_POLICYCOMMISION_Delete_AdminWeb')
        return new ServiceResponse(true, '', true)
    } catch (error) {
        logger.error(error, {
            function: 'policy-commision.service.deletePolicyCommision',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getDataSelect = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .execute('AFF_POLICYCOMMISION_GetDataSelect_AdminWeb');

        let affiliate_types = policyCommisionClass.listAffiliateType(res.recordsets[0]);
        let conditions = policyCommisionClass.listCondition(res.recordsets[1]);
        affiliate_types = (affiliate_types || []).map(p => {
            return {
                ...p,
                label: p.affiliate_type_name,
                value: p.affiliate_type_id
            }
        })
        conditions = (conditions || []).map(p => {
            return {
                ...p,
                label: p.condition_name,
                value: p.condition_id
            }
        })

        return new ServiceResponse(true, '', { affiliate_types, conditions })
    } catch (error) {
        logger.error(error, {
            function: 'policy-commision.service.getDataSelect',
        });
        return new ServiceResponse(false, error.message);
    }
}

const createOrUpdPolicyCommision = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        let policy_commision_id = apiHelper.getValueFromObject(bodyParams, 'policy_commsion_id', 0);
        let policy_commision_name = apiHelper.getValueFromObject(bodyParams, 'policy_commision_name', null);
        let affiliate_type_id = apiHelper.getValueFromObject(bodyParams, 'affiliate_type_id', 0);
        let description = apiHelper.getValueFromObject(bodyParams, 'description', null);
        let is_active = apiHelper.getValueFromObject(bodyParams, 'is_active', true);
        let is_default = apiHelper.getValueFromObject(bodyParams, 'is_default', false);
        let is_limited_time = apiHelper.getValueFromObject(bodyParams, 'is_limited_time', false);
        let created_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let start_date_register = apiHelper.getValueFromObject(bodyParams, 'start_date_register', null);
        let end_date_register = apiHelper.getValueFromObject(bodyParams, 'end_date_register', null);
        let policy_commision_detail = apiHelper.getValueFromObject(bodyParams, 'policy_commision_detail', []);

        await transaction.begin();

        const reqPolicy = new sql.Request(transaction);
        const resPolicy = await reqPolicy
            .input('POLICYCOMMISIONID', policy_commision_id)
            .input('POLICYCOMMISIONNAME', policy_commision_name)
            .input('DESCRIPTION', description)
            .input('AFFILIATETYPEID', affiliate_type_id)
            .input('ISACTIVE', is_active)
            .input('ISDEFAULT', is_default)
            .input('ISLIMITEDTIME', is_limited_time)
            .input('STARTDATEREGISTER', start_date_register)
            .input('ENDDATEREGISTER', end_date_register)
            .input('CREATEDUSER', created_user)
            .execute('AFF_POLICYCOMMISION_CreateOrUpdate_AdminWeb');

        const { RESULT: policyCommisionId = null } = resPolicy.recordset[0];
        if (!policyCommisionId) {
            await transaction.rollback()
            return new ServiceResponse(false, `Lỗi ${policy_commision_id ? 'cập nhật' : 'thêm mới'} thông tin chính sách.`)
        }

        if (policy_commision_id) {
            const reqDelPolicyDetail = new sql.Request(transaction);
            await reqDelPolicyDetail
                .input('POLICYCOMMISIONID', policy_commision_id)
                .input('DELETEDUSER', created_user)
                .execute('AFF_POCOMMISION_DETAIL_Delete_AdminWeb')
        }

        if (policy_commision_detail && policy_commision_detail.length) {
            const reqPolicyDetail = new sql.Request(transaction);
            for (let i = 0; i < policy_commision_detail.length; i++) {
                const item = policy_commision_detail[i];
                let { data_child = [] } = item || {};
                if (data_child && data_child.length) {
                    for (let j = 0; j < data_child.length; j++) {
                        const _child = data_child[j];
                        await reqPolicyDetail
                            .input('POLICYCOMMISIONID', policyCommisionId)
                            .input('CONDITIONID', item.condition_id)
                            .input('FROMVALUE', _child.from_value)
                            .input('TOVALUE', _child.to_value)
                            .input('TYPE', 1) //1: %
                            .input('COMISSIONVALUE', _child.comission_value)
                            .input('CREATEDUSER', created_user)
                            .execute('AFF_POCOMMISION_DETAIL_Create_AdminWeb')

                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', policyCommisionId)
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'policy-commision.service.createOrUpdPolicyCommision',
        });
        return new ServiceResponse(false, error.message);
    }
}

const detailPolicy = async (id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('POLICYCOMMISIONID', id)
            .execute('AFF_POLICYCOMMISION_GetById_AdminWeb')

        let policy_commision = policyCommisionClass.detail(res.recordsets[0][0] || {});
        let _details = policyCommisionClass.listPolicyDetail(res.recordsets[1] || []);
        let policy_commision_detail = [];
        for (let j = 0; j < _details.length; j++) {
            let {
                condition_id = 0,
                policy_commision_id,
                condition_type,
                from_value,
                to_value,
                comission_value,
                type,
                condition_name
            } = _details[j] || {};
            let _find = policy_commision_detail.find(p => p.condition_id == condition_id);
            if (!_find) {
                policy_commision_detail.push({
                    policy_commision_id,
                    condition_id,
                    condition_name,
                    condition_type,
                    order_index: policy_commision_detail.length + 1,
                    data_child: [{
                        condition_id,
                        from_value,
                        to_value,
                        type,
                        comission_value,
                        condition_type
                    }]
                })
            }
            else {
                _find.data_child =  _find.data_child.concat({
                    condition_id,
                    from_value,
                    to_value,
                    type,
                    comission_value,
                    condition_type
                })
            }
        }

        if (policy_commision) {
            policy_commision.policy_commision_detail = policy_commision_detail
        }
        return new ServiceResponse(true, '', policy_commision)
    } catch (error) {
        logger.error(error, {
            function: 'policy-commision.service.detailPolicy',
        });
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getListPolicyCommision,
    deletePolicyCommision,
    getDataSelect,
    createOrUpdPolicyCommision,
    detailPolicy
}