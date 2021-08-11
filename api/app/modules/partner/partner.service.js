const partnerClass = require('../partner/partner.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const fileHelper = require('../../common/helpers/file.helper');
const stringHelper = require('../../common/helpers/string.helper');
const config = require('../../../config/config');
const { Console } = require('winston/lib/winston/transports');

/**
 * Get list MD_PARTNER
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListPartner = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
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
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.MD_PARTNER_GETLIST_ADMINWEB);
    const datas = data.recordset;

    return new ServiceResponse(true, '', {
      data: partnerClass.list(datas),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(datas),
    });
  } catch (e) {
    logger.error(e, { function: 'partnerService.getListNews' });
    return new ServiceResponse(true, '', {});
  }
};

const detailPartner = async (partner_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PARTNERID', partner_id)
      .execute(PROCEDURE_NAME.MD_PARTNER_GETBYID_ADMINWEB);

    let datas = data.recordset;
    // If exists partner
    if (datas && datas.length > 0) {
      datas = partnerClass.detail(datas[0]);
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'partnerService.detailPartner' });
    return new ServiceResponse(false, e.message);
  }
};

const deletePartner = async (partner_id, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('PARTNERID', partner_id)
      .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_PARTNER_DELETE);
    removeCacheOptions();
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'PartnerService.deletePartner',
    });
    return new ServiceResponse(false, e.message);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.MD_PARTNER_OPTIONS);
};

const createPartnerOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    let partner_id = apiHelper.getValueFromObject(bodyParams, 'partner_id'); 
    //check name
      const dataCheckUsername = await pool
        .request()
        .input(
          'PARTNERID',
          apiHelper.getValueFromObject(bodyParams, 'partner_id')
        )
        .input(
          'USERNAME',
          apiHelper.getValueFromObject(bodyParams, 'user_name')
        )
        .execute(PROCEDURE_NAME.MD_PARTNER_CHECK_USERNAME);
      if (!dataCheckUsername.recordset || !dataCheckUsername.recordset[0].RESULT) {
        return new ServiceResponse(
          false,
          RESPONSE_MSG.PARTNER.EXISTS_USER_NAME,
          null
        );
      }

      const dataCheckPartnerName = await pool
        .request()
        .input(
          'PARTNERID',
          apiHelper.getValueFromObject(bodyParams, 'partner_id')
        )
        .input(
          'PARTNERNAME',
          apiHelper.getValueFromObject(bodyParams, 'partner_name')
        )
        .execute(PROCEDURE_NAME.MD_PARTNER_CHECK_PARTNERNAME);
      if (!dataCheckPartnerName.recordset || !dataCheckPartnerName.recordset[0].RESULT) {
        return new ServiceResponse(
          false,
          RESPONSE_MSG.PARTNER.EXISTS_PARTNER_NAME,
          null
        );
      }

      const data = await pool
      .request()
      .input('PARTNERID', partner_id)
      .input(
        'PARTNERNAME',
        apiHelper.getValueFromObject(bodyParams, 'partner_name')
      )
      .input(
        'PHONENUMBER',
        apiHelper.getValueFromObject(bodyParams, 'phone_number')
      )
      .input('EMAIL', apiHelper.getValueFromObject(bodyParams, 'email'))
      .input(
        'COUNTRYID',
        apiHelper.getValueFromObject(bodyParams, 'country_id')
      )
      .input(
        'PROVINCEID',
        apiHelper.getValueFromObject(bodyParams, 'province_id')
      )
      .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
      .input(
        'DISTRICTID',
        apiHelper.getValueFromObject(bodyParams, 'district_id')
      )
      .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address'))
      .input('FAX', apiHelper.getValueFromObject(bodyParams, 'fax'))
      .input('TAXID', apiHelper.getValueFromObject(bodyParams, 'tax_id'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input(
        'BANKNUMBER',
        apiHelper.getValueFromObject(bodyParams, 'bank_number')
      )
      .input(
        'BANKACCOUNTNAME',
        apiHelper.getValueFromObject(bodyParams, 'bank_account_name')
      )
      .input('BANKNAME', apiHelper.getValueFromObject(bodyParams, 'bank_name'))
      .input(
        'BANKROUTING',
        apiHelper.getValueFromObject(bodyParams, 'bank_routing')
      )
      .input(
        'BANKACCOUNTID',
        apiHelper.getValueFromObject(bodyParams, 'bank_account_id')
      )
      .input(
        'CREATEDUSER',
        apiHelper.getValueFromObject(bodyParams, 'auth_name')
      )
      .input(
        'ADDRESSFULL',
        apiHelper.getValueFromObject(bodyParams, 'address_full')
      )
      .input('OWERNAME', apiHelper.getValueFromObject(bodyParams, 'ower_name'))
      .input(
        'OWERPHONE1',
        apiHelper.getValueFromObject(bodyParams, 'ower_phone_1')
      )
      .input(
        'OWERPHONE2',
        apiHelper.getValueFromObject(bodyParams, 'ower_phone_2')
      )
      .input(
        'OWEREMAIL',
        apiHelper.getValueFromObject(bodyParams, 'ower_email')
      )
      .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'user_name'))
      // .input('PASSWORD', apiHelper.getValueFromObject(bodyParams, 'password'))
      .input('PASSWORD', stringHelper.hashPassword(apiHelper.getValueFromObject(bodyParams, 'password')))
      .execute(PROCEDURE_NAME.MD_PARTNER_CREATEORUPDATE_ADMINWEB);
    const partnerId = data.recordset[0].RESULT;
    return new ServiceResponse(true, '', partnerId);
  } catch (e) {
    logger.error(e, {
      function: 'partnerService.createPartnerOrUpdate',
    });
    return new ServiceResponse(false);
  }
};

const detaiPartner = async (partner_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PARTNERID', partner_id)
      .execute(PROCEDURE_NAME.MD_PARTNER_GETBYID_ADMINWEB);

    let datas = data.recordset;
    // If exists partner
    if (datas && datas.length > 0) {
      datas = partnerClass.detail(datas[0]);
      return new ServiceResponse(true, '', datas);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'partnerService.detailPartner' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListPartner,
  detailPartner,
  deletePartner,
  createPartnerOrUpdate,
  detaiPartner,
};
