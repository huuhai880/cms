const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { saveImage } = require('../../common/helpers/saveFile.helper');
const withdrawRequestClass = require('./withdraw-request.class');
const sql = require('mssql');
const events = require('../../common/events')
const htmlHelper = require('../../common/helpers/html.helper');
const config = require('../../../config/config');

const getListWithdrawRequest = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const status = apiHelper.getValueFromObject(queryParams, 'status', 0);
        const start_date_request = apiHelper.getValueFromObject(queryParams, 'start_date_request', null);
        const end_date_request = apiHelper.getValueFromObject(queryParams, 'end_date_request', null)
        const start_date_confirm = apiHelper.getValueFromObject(queryParams, 'start_date_confirm', null);
        const end_date_confirm = apiHelper.getValueFromObject(queryParams, 'end_date_confirm', null)
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('keyword', keyword)
            .input('startdaterequest', start_date_request)
            .input('enddaterequest', end_date_request)
            .input('startdateconfirm', start_date_confirm)
            .input('enddateconfirm', end_date_confirm)
            .input('status', status)
            .input('pagesize', itemsPerPage)
            .input('pageindex', currentPage)
            .execute('WA_WITHDRAWREQUEST_GetList_AdminWeb');

        let list = withdrawRequestClass.list(res.recordset);
        let total = apiHelper.getTotalData(res.recordset);

        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'withdraw-request.service.getListWithdrawRequest',
        });
        return new ServiceResponse(false, error.message);
    }
}

const getWithdrawRequestDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('WDREQUESTID', id)
            .execute('WA_WITHDRAWREQUEST_GetById_AdminWeb')
        return new ServiceResponse(true, "", withdrawRequestClass.detail(res.recordset[0]))
    } catch (error) {
        logger.error(error, {
            function: 'withdraw-request.service.getWithdrawRequestDetail',
        });
        return new ServiceResponse(false, error.message);
    }
}

const rejectWithdrawRequest = async (bodyParams = {}) => {
    try {
        let wd_request_id = apiHelper.getValueFromObject(bodyParams, 'wd_request_id', null);
        let note = apiHelper.getValueFromObject(bodyParams, 'note', null);
        let confirm_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let email = apiHelper.getValueFromObject(bodyParams, 'email', null);
        let wd_request_no = apiHelper.getValueFromObject(bodyParams, 'wd_request_no', null);
        let fullname = apiHelper.getValueFromObject(bodyParams, 'full_name', null);

        const pool = await mssql.pool;
        await pool.request()
            .input('WDREQUESTID', wd_request_id)
            .input('CONFIRMUSER', confirm_user)
            .input('NOTE', note)
            .execute('WA_WITHDRAWREQUEST_Reject_AdminWeb');

        //Send email không duyệt
        if (email) {
            events.emit('send-email', {
                to: email,
                subject: '[TSH] Kết quả yêu cầu rút tiền',
                html: htmlHelper.format({
                    template: 'rejectrequest.html',
                    mail: {
                        fullname,
                        note,
                        requestNo: wd_request_no,
                        link: config.website,
                    },
                }),
            });
        }

        return new ServiceResponse(true, "", true)
    } catch (error) {
        logger.error(error, {
            function: 'withdraw-request.service.rejectWithdrawRequest',
        });
        return new ServiceResponse(false, error.message);
    }
}

const acceptWithdrawRequest = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        let wd_request_id = apiHelper.getValueFromObject(bodyParams, 'wd_request_id', null);
        let payment_image = apiHelper.getValueFromObject(bodyParams, 'payment_image', null);
        let confirm_user = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let wd_request_no = apiHelper.getValueFromObject(bodyParams, 'wd_request_no', null);

        if (payment_image) {
            try {
                const path_payment_image = await saveImage('withdrawrequest', payment_image);
                if (path_payment_image) {
                    payment_image = path_payment_image;
                }
                else {
                    return new ServiceResponse(false, 'Vui lòng upload ảnh < 4MB.');
                }
            } catch (error) {
                return new ServiceResponse(false, 'Vui lòng upload ảnh < 4MB.');
            }
        }

        await transaction.begin()

        //UPDATE WA_REQUEST
        const reqWithdrawRq = new sql.Request(transaction);
        await reqWithdrawRq
            .input('WDREQUESTID', wd_request_id)
            .input('CONFIRMUSER', confirm_user)
            .input('WDREQUESTNO', wd_request_no)
            .execute('WA_WITHDRAWREQUEST_Accept_AdminWeb');

        //TRANS OUT
        const reqTransOut = new sql.Request(transaction);
        await reqTransOut
            .input('WDREQUESTID', wd_request_id)
            .input('PAYMENTIMAGE', payment_image)
            .input('CREATEDUSER', confirm_user)
            .execute('WA_WALLETTRANS_OUT_Create_AdminWeb');

        await transaction.commit()
        return new ServiceResponse(true, "", true)
    } catch (error) {
        await transaction.rollback()
        logger.error(error, {
            function: 'withdraw-request.service.acceptWithdrawRequest',
        });
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getListWithdrawRequest,
    getWithdrawRequestDetail,
    rejectWithdrawRequest,
    acceptWithdrawRequest
}