const PositionClass = require('./position.class');
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
const folderName = 'position';
const config = require('../../../config/config');
const getListPosition = async (queryParams = {}) => {
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
        'ISACTIVE',
        apiHelper.getFilterBoolean(queryParams, 'selectdActive')
      )
      .execute('MD_POSITION_GetAll');

    const result = data.recordset;
    // console.log(data)

    return new ServiceResponse(true, '', {
      data: PositionClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'PositionService.getListPosition',
    });

    return new ServiceResponse(true, '', {});
  }
};
const createOrUpdatePosition = async (body = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    // Save create
    const requestPosition = new sql.Request(transaction);
    const resultPosition = await requestPosition
      .input('POSITIONID', apiHelper.getValueFromObject(body, 'position_id'))
      .input(
        'POSITIONNAME',
        apiHelper.getValueFromObject(body, 'position_name')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_POSITION_CreateOrUpdate');
    const position_id = resultPosition.recordset[0].RESULT;
    if (position_id > 0) {
      //   removeCacheOptions();
      await transaction.commit();
    }
    return new ServiceResponse(true, '', position_id);
  } catch (error) {
    logger.error(error, {
      function: 'PositionService.createOrUpdatePosition',
    });
    console.error('PositionService.createOrUpdatePosition', error);
    return new ServiceResponse(false, e.message);
  }
};
const detailPosition = async (memberid) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('POSITIONID', memberid)
      .execute('MD_POSITION_GetById');
    const Position = data.recordset[0];
    // console.log(Account)
    if (Position) {
      return new ServiceResponse(true, '', PositionClass.detail(Position));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'PositionService.detailPosition',
    });

    return new ServiceResponse(false, e.message);
  }
};
const deletePosition = async (position_id, body) => {
    // console.log(position_id, authName)
  const pool = await mssql.pool;
  try {
    // Delete user group
    await pool
      .request()
      .input('POSITIONID', position_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_POSITION_delete');

    // removeCacheOptions();
// console.log(ServiceResponse(true))
    // Return ok
    return new ServiceResponse(true,'');
  } catch (e) {
    logger.error(e, {
      function: 'PositionService.deletePosition',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
module.exports = {
  getListPosition,
  createOrUpdatePosition,
  detailPosition,
  deletePosition,
};
