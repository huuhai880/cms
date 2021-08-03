const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { encrypt } = require('../../common/helpers/crypto.helper');


const createOtp = async (body) => {
  try {
    const otp_code = Math.random().toString(36).slice(-8);
    const pool = await mssql.pool;
    await pool.request()
      .input('AUTHORID', apiHelper.getValueFromObject(body, 'author_id'))
      .input('OTPCODE', otp_code)
      .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
      .execute(PROCEDURE_NAME.CRM_ACCOTP_CREATE_ADMINWEB);
    return new ServiceResponse(true, '', {token: encrypt(otp_code)});
  } catch (e) {
    logger.error(e, {
      'function': 'otpService.create',
    });

    return new ServiceResponse(false, e.message);
  }
};


module.exports = {
  createOtp,
};
