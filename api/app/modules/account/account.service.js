const crmAccountClass = require('../account/account.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const stringHelper = require('../../common/helpers/string.helper');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'account';
const config = require('../../../config/config');

const getListCRMAccount = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input(
                'COUNTRYID',
                apiHelper.getValueFromObject(queryParams, 'country_id')
            )
            .input(
                'PROVINCEID',
                apiHelper.getValueFromObject(queryParams, 'province_id')
            )
            .input(
                'DISTRICTID',
                apiHelper.getValueFromObject(queryParams, 'district_id')
            )
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input(
                'FROMBIRTHDAY',
                apiHelper.getValueFromObject(queryParams, 'from_birth_day')
            )
            .input(
                'TOBIRTHDAY',
                apiHelper.getValueFromObject(queryParams, 'to_birth_day')
            )
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
            .input(
                'TYPEREGISTER',
                apiHelper.getValueFromObject(queryParams, 'type_register')
            )
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETLIST_ADMINWEB);

        const Account = data.recordset;

        return new ServiceResponse(true, '', {
            data: crmAccountClass.list(Account),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(Account),
        });
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.getListCRMAccount',
        });

        return new ServiceResponse(true, '', {});
    }
};

const createCRMAccount = async (body = {}) => {
    return await createCRMAccountOrUpdate(body);
};

const updateCRMAccount = async (body = {}, member_id) => {
    body.member_id = member_id;
    return await createCRMAccountOrUpdate(body);
};

const checkEmail = async (email) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('EMAIL', email)
            .execute('CRM_ACCOUNT_CheckEmail_AdminWeb');
        const res = data.recordset[0];
        if (res) {
            return new ServiceResponse(true, '', res);
        }
        return new ServiceResponse(true, '', '');
    } catch (error) {
        return new ServiceResponse(false, error.message);
    }
};

const checkPhone = async (phone_number) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PHONENUMBER', phone_number)
            .execute('CRM_ACCOUNT_Phone_AdminWeb');
        const res = data.recordset[0];
        if (res) {
            return new ServiceResponse(true, '', res);
        }
        return new ServiceResponse(true, '', '');
    } catch (error) {
        return new ServiceResponse(false, error.message);
    }
};

const checkIdCard = async (id_card) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('IDCARD', id_card)
            .execute('CRM_ACCOUNT_CheckIdcard_AdminWeb');
        const res = data.recordset[0];
        if (res) {
            return new ServiceResponse(true, '', res);
        }
        return new ServiceResponse(true, '', '');
    } catch (error) {
        return new ServiceResponse(false, error.message);
    }
};

const createCRMAccountOrUpdate = async (body = {}) => {
    let image_avatar = apiHelper.getValueFromObject(body, 'image_avatar');
    let id_front = apiHelper.getValueFromObject(body, 'id_card_front_image');
    let id_back = apiHelper.getValueFromObject(body, 'id_card_back_image');
    let live_image = apiHelper.getValueFromObject(body, 'live_image');

    if (image_avatar) {
        const path_image_avatar = await saveFile(image_avatar, folderName);
        if (path_image_avatar) {
            image_avatar = path_image_avatar;
        }
    }
    if (id_front) {
        const path_id_front = await saveFile(id_front, folderName);
        if (path_id_front) {
            id_front = path_id_front;
        }
    }
    if (id_back) {
        const path_id_back = await saveFile(id_back, folderName);
        if (path_id_back) {
            id_back = path_id_back;
        }
    }
    if (live_image) {
        const path_live_image = await saveFile(live_image, folderName);
        if (path_live_image) {
            live_image = path_live_image;
        }
    }
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        let password = apiHelper.getValueFromObject(body, 'pass_word');
        password = stringHelper.hashPassword(password);
        const requestAccount = new sql.Request(transaction);
        const resultAccount = await requestAccount
            .input('MEMBERID', apiHelper.getValueFromObject(body, 'member_id'))
            .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
            .input('PASSWORD', password)
            .input(
                'CUSTOMERTYPEID',
                apiHelper.getValueFromObject(body, 'customer_type_id')
            )
            .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birth_day'))
            .input(
                'CUSTOMERCODE',
                apiHelper.getValueFromObject(body, 'customer_code')
            )
            .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
            .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name'))
            .input('NICKNAME', apiHelper.getValueFromObject(body, 'nick_name'))
            .input('IMAGEAVATAR', image_avatar)
            .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
            .input(
                'MARITALSTATUS',
                apiHelper.getValueFromObject(body, 'marital_status')
            )
            .input('IDCARD', apiHelper.getValueFromObject(body, 'id_card'))
            .input('IDCARDDATE', apiHelper.getValueFromObject(body, 'id_card_date'))
            .input('IDCARDPLACE', apiHelper.getValueFromObject(body, 'id_card_place'))
            .input('IDCARDFRONTSIDE', id_front)
            .input('IDCARDBACKSIDE', id_back)
            .input('IDCARDBACKSIDE', id_back)
            .input('LIVEIMAGE', live_image)
            .input('ADDRESS', apiHelper.getValueFromObject(body, 'address'))
            .input('PROVINCEID', apiHelper.getValueFromObject(body, 'province_id'))
            .input('WARDID', apiHelper.getValueFromObject(body, 'ward_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(body, 'district_id'))
            .input('FACEBOOKURL', apiHelper.getValueFromObject(body, 'facebook'))
            .input('TWITTERURL', apiHelper.getValueFromObject(body, 'twitter'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('REFERRALCODE', apiHelper.getValueFromObject(body, 'referral_code'))
            .execute('CRM_ACCOUNT_CreateOrUpdate_AdminWeb');
        const member_id = resultAccount.recordset[0].RESULT;
        if (member_id > 0) {
            removeCacheOptions();
            await transaction.commit();
        }
        return new ServiceResponse(true, '', member_id);
    } catch (error) {
        logger.error(error, {
            function: 'AccountService.createCRMAccountOrUpdate',
        });
        console.error('AccountService.createCRMAccountOrUpdate', error);
        return new ServiceResponse(false, e.message);
    }
};

const detailCRMAccount = async (memberid) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('MEMBERID', memberid)
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETBYID_ADMINWEB);
        const Account = data.recordset[0];
        if (Account) {
            return new ServiceResponse(true, '', crmAccountClass.detail(Account));
        }
        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.detailAccount',
        });

        return new ServiceResponse(false, e.message);
    }
};

const deleteCRMAccount = async (memberid, authName) => {
    const pool = await mssql.pool;
    try {
        await pool
            .request()
            .input('MEMBERID', memberid)
            .input('UPDATEDUSER', authName)
            .execute('CRM_ACCOUNT_Delete_AdminWeb');

        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.deleteAccount',
        });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const changeStatusCRMAccount = async (memberid, authName, isActive) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('MEMBERID', memberid)
            .input('ISACTIVE', isActive)
            .input('UPDATEDUSER', authName)
            .execute('CRM_ACCOUNT_UpdateStatus_AdminWeb');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.changeStatusCRMAccount',
        });

        return new ServiceResponse(false);
    }
};

const saveFile = async (base64, folderName) => {
    let url = null;

    try {
        if (fileHelper.isBase64(base64)) {
            const extension = fileHelper.getExtensionFromBase64(base64);
            const guid = createGuid();
            url = await fileHelper.saveBase64(
                folderName,
                base64,
                `${guid}.${extension}`
            );
        } else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.saveFile',
        });
    }
    return url;
};

const createGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_ACCOUNT_OPTIONS);
};

const changePassCRMAccount = async (memberid, body = {}) => {
    try {
        const pool = await mssql.pool;
        let password = apiHelper.getValueFromObject(body, 'password');
        password = stringHelper.hashPassword(password);
        await pool
            .request()
            .input('MEMBERID', memberid)
            .input('PASSWORD', password)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_CHANGEPASS_ADMINWEB);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.changePassCRMAccount',
        });

        return new ServiceResponse(false);
    }
};

const genCode = async () => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_GENCODE_PORTAL);
        const Account = data.recordset[0];
        // console.log(Account)
        if (Account) {
            return new ServiceResponse(true, '', Account);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.genCode',
        });

        return new ServiceResponse(false, e.message);
    }
};

const getCustomerList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('CRM_ACCOUNT_GetListCustomerType_AdminWeb');
        const result = data.recordset;
        // console.log(result);

        return new ServiceResponse(true, '', {
            data: crmAccountClass.listCustomerType(result),
        });
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.getCustomerList',
        });

        return new ServiceResponse(true, '', {});
    }
};

const getOptionAff = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .execute('CRM_ACCOUNT_GetOptionAff_AdminWeb');
        return new ServiceResponse(true, '', res.recordset)
    } catch (error) {
        logger.error(e, {
            function: 'AccountService.getOptionAff',
        });
        return new ServiceResponse(true, '', {});
    }
}

module.exports = {
    getListCRMAccount,
    createCRMAccount,
    updateCRMAccount,
    detailCRMAccount,
    deleteCRMAccount,
    changeStatusCRMAccount,
    changePassCRMAccount,
    genCode,
    checkEmail,
    getCustomerList,
    checkIdCard,
    checkPhone,
    getOptionAff
};
