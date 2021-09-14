const ParamDobClass = require('./param-dob.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

///////get  ParamDobClass
const getParamsListByBirthday = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input(
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'startDate')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'endDate')
      )
      .input(
        'ISACTIVE',
        apiHelper.getFilterBoolean(queryParams, 'selectdActive')
      )
      .execute('MD_PARAMDOB_GetList_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: ParamDobClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'ParamDobService.getParamsListByBirthday',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////delete Param type
const deleteParamByBirthday = async (param_id, body) => {
  const pool = await mssql.pool;
  // console.log(param_id)
  try {
    await pool
      .request()
      .input('PARAMDOBID', param_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_PARAMDOB_Delete_AdminWeb');
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'ParamDobService.deleteParamByBirthday',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
/// add or update Param type
const addParamByBirthday = async (body = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);
    const result = await request
      .input('PARAMTYPEID', apiHelper.getValueFromObject(body, 'param_type_id'))
      .input('PARAMTYPE', apiHelper.getValueFromObject(body, 'param_type'))
      .input('ISDAY', apiHelper.getValueFromObject(body, 'is_day'))
      .input('ISMONTH', apiHelper.getValueFromObject(body, 'is_month'))
      .input('ISYEAR', apiHelper.getValueFromObject(body, 'is_year'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_PARAMDOB_CreateOrUpdate_AdminWeb');
    const param_id = result.recordset[0].RESULT;

    if (param_id > 0) {
      // removeCacheOptions();
      await transaction.commit();
    }
    return new ServiceResponse(true, '', param_id);
  } catch (error) {
    logger.error(error, {
      function: 'ParamDobService.addParamByBirthday',
    });
    console.error('letterService.addLetter', error);
    return new ServiceResponse(false, e.message);
  }
};
///////detail param-type
const detailParamDob = async (param_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PARAMTYPEID', param_id)
      .execute('MD_PARAMDOB_GetById_AdminWeb');
    const result = data.recordset[0];
    // console.log(Account)
    if (result) {
      return new ServiceResponse(true, '', ParamDobClass.list(result));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'ParamDobService.detailParamDobClass',
    });

    return new ServiceResponse(false, e.message);
  }
};
/////check param type
const CheckParamDob = async (param_type) => {
  // console.log(param_type)
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('DOBTYPE', param_type)
      .execute('MD_PARAMDOB_CheckLetter_AdminWeb');
    const res = data.recordset[0];
    if (res) {
      return new ServiceResponse(true, '', res);
    }
    return new ServiceResponse(true, '', '');
  } catch (error) {
    return new ServiceResponse(false, error.message);
  }
};
module.exports = {
  getParamsListByBirthday,
  deleteParamByBirthday,
  addParamByBirthday,
  detailParamDob,CheckParamDob
};
