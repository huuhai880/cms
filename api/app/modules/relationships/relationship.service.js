const RelationshipClass = require('./relationship.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
// const fileHelper = require('../../common/helpers/file.helper');
// const folderName = 'mainNumber';
// const config = require('../../../config/config');
///////get list main number
const getRelationshipsList = async (queryParams = {}) => {
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
      .execute('MD_RELATIONSHIPS_GetList_AdminWeb');
    const result = data.recordset;
    // console.log(apiHelper.getTotalData(result));

    return new ServiceResponse(true, '', {
      data: RelationshipClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'RelationshipService.getRelationshipsList',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////delete Letter
const deleteRelationship = async (relationships_id, body) => {
  // console.log(relationships_id)
  const pool = await mssql.pool;
  try {
    await pool
      .request()
      .input('RELATIONSHIPID', relationships_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_RELATIONSHIPS_Delete_AdminWeb');
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'RelationshipService.deleteRelationship',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
/////check Relationship
const CheckRelationship = async (relationship) => {
  // console.log(relationship)
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('RELATIONSHIP', relationship)
      .execute('MD_RELATIONSHIPS_CheckRelationship_AdminWeb');
    const res = data.recordset[0];
    if (res) {
      return new ServiceResponse(true, '', res);
    }
    return new ServiceResponse(true, '', '');
  } catch (error) {
    return new ServiceResponse(false, error.message);
  }
};
/// add or update Relationship
const addRelationship = async (body = {}) => {
  // console.log(body);

  // console.log(body)
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();

    /////create or update number
    const requestLetter = new sql.Request(transaction);
    const resultLetter = await requestLetter
      .input(
        'RELATIONSHIPID',
        apiHelper.getValueFromObject(body, 'relationship_id')
      )
      .input('RELATIONSHIP', apiHelper.getValueFromObject(body, 'relationship'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('NOTE', apiHelper.getValueFromObject(body, 'note'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_RELATIONSHIPS_CreateOrUpdate_AdminWeb');
    const letter_id = resultLetter.recordset[0].RESULT;

    if (letter_id > 0) {
      // removeCacheOptions();
      await transaction.commit();
    }
    return new ServiceResponse(true, '', letter_id);
  } catch (error) {
    logger.error(error, {
      function: 'RelationshipService.addRelationship',
    });
    // console.error('letterService.addLetter', error);
    return new ServiceResponse(false, e.message);
  }
};
///////detail Relationship
const detailRelationship = async (relationships_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('RELATIONSHIPID', relationships_id)
      .execute('MD_RELATIONSHIPS_GetById_AdminWeb');
    const Letter = data.recordset[0];
    // console.log(Letter)
    if (Letter) {
      return new ServiceResponse(true, '', RelationshipClass.list(Letter));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'RelationshipService.detailRelationship',
    });

    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getRelationshipsList,
  deleteRelationship,
  detailRelationship,
  CheckRelationship,
  addRelationship,
};
