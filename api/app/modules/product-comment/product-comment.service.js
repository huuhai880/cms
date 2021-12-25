const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const config = require('../../../config/config');
const productCommentClass = require('./product-comment.class')

const getListComment = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword', '');
        const is_review = apiHelper.getValueFromObject(queryParams, 'is_review', 2);
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date', null);
        const end_date = apiHelper.getValueFromObject(queryParams, 'end_date', null);
        const product_id = apiHelper.getValueFromObject(queryParams, 'product_id', 0);
        const is_combo = apiHelper.getValueFromObject(queryParams, 'is_combo', 0);
        const is_deleted = apiHelper.getValueFromObject(queryParams, 'is_deleted', 2);
        
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('PRODUCTID', product_id)
            .input('ISCOMBO', is_combo)
            .input('KEYWORD', keyword)
            .input('FROMDATE', start_date)
            .input('TODATE', end_date)
            .input('ISREVIEW', is_review)
            .input('ISDELETED', 0)
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .execute('PRO_COMMENT_GetList_AdminWeb');

        let list = productCommentClass.listComment(res.recordset);
        let total = apiHelper.getTotalData(res.recordset);

        let commentIds = list.map(i => i.product_comment_id).join(",");
        const resReply = await pool.request()
            .input('PRODUCTCOMMENTIDS', commentIds)
            .input('KEYWORD', keyword)
            .execute('PRO_COMMENT_GetListReplyByIds_AdminWeb')


        let listReply = productCommentClass.listComment(resReply.recordset);
        for (let i = 0; i < list.length; i++) {
            let comment = list[i];
            let reply_comments = listReply.filter(p => p.comment_reply_id == comment.product_comment_id) || [];
            comment.reply_comments = reply_comments;
        }
        return new ServiceResponse(true, "", { list, total })
    } catch (error) {
        logger.error(error, {
            function: 'product-comment.service.getListComment',
        });
        return new ServiceResponse(false, error.message);
    }
}

const deleteComment = async (product_comment_id, deletedUser) => {
    try {
        console.log(product_comment_id)
        const pool = await mssql.pool;
        await pool.request()
            .input('PRODUCTCOMMENTID', product_comment_id)
            .input('DELETEDUSER', deletedUser)
            .execute('PRO_COMMENT_Delete_AdminWeb')

        return new ServiceResponse(true, '', 1)
    } catch (error) {
        logger.error(error, {
            function: 'product-comment.service.deleteComment',
        });
        return new ServiceResponse(false, error.message);
    }
}

const reviewComment = async (product_comment_id, review_user, is_review) => {
    try {
        const pool = await mssql.pool;
        await pool.request()
            .input('PRODUCTCOMMENTID', product_comment_id)
            .input('REVIEWUSER', review_user)
            .input('ISREVIEW', is_review)
            .execute('PRO_COMMENT_Review_AdminWeb')

        return new ServiceResponse(true, '', { is_review, product_comment_id })
    } catch (error) {
        logger.error(error, {
            function: 'product-comment.service.reviewComment',
        });
        return new ServiceResponse(false, error.message);
    }
}

const replyComment = async (bodyParams = {}) => {
    try {
        let product_id = apiHelper.getValueFromObject(bodyParams, 'product_id', null);
        let is_combo = apiHelper.getValueFromObject(bodyParams, 'is_combo', 0);
        let comment_reply_id = apiHelper.getValueFromObject(bodyParams, 'comment_reply_id', 0);
        let auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let content_comment = apiHelper.getValueFromObject(bodyParams, 'content_comment', 'administrator');


        const pool = await mssql.pool;
        const res = await pool.request()
            .input('PRODUCTID', product_id)
            .input('ISCOMBO', is_combo)
            .input('COMMENTREPLYID', comment_reply_id)
            .input('REPLYUSER', auth_name)
            .input('CONTENTCOMMENT', content_comment ? content_comment.replace(/<[^>]*>?/gm, '') : '')
            .execute('PRO_COMMENT_Reply_AdminWeb')
        let { product_comment_id } = res.recordset[0]

        return new ServiceResponse(true, '', product_comment_id)
    } catch (error) {
        logger.error(error, {
            function: 'product-comment.service.replyComment',
        });
        return new ServiceResponse(false, error.message);
    }
}

module.exports = {
    getListComment,
    deleteComment,
    reviewComment,
    replyComment
}