const LetterClass = require('./letter.class');
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
const getLettersList = async (queryParams = {}) => {
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
      .execute('MD_LETTERS_GetList_AdminWeb');
    const result = data.recordset;
    // console.log(apiHelper.getTotalData(result));

    return new ServiceResponse(true, '', {
      data: LetterClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'letterService.getLettersList',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////delete Letter
const deleteLetter = async (letter_id, body) => {
  const pool = await mssql.pool;
  try {
    await pool
      .request()
      .input('LETTERID', letter_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_LETTERS_Delete_AdminWeb');
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'letterService.deleteLetter',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
/////check letter
const CheckLetter = async (letter) => {
  // console.log(email)
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('LETTER', letter)
      .execute('MD_LETTER_CheckLetter_AdminWeb');
    const res = data.recordset[0];
    if (res) {
      return new ServiceResponse(true, '', res);
    }
    return new ServiceResponse(true, '', '');
  } catch (error) {
    return new ServiceResponse(false, error.message);
  }
};
/// add or update letter
const addLetter = async (body = {}) => {
  // console.log(body);

  // console.log(body)
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();

    /////create or update number
    const requestLetter = new sql.Request(transaction);
    const resultLetter = await requestLetter
      .input('LETTERID', apiHelper.getValueFromObject(body, 'letter_id'))
      .input('LETTER', apiHelper.getValueFromObject(body, 'letter'))
      .input('NUMBER', apiHelper.getValueFromObject(body, 'number'))
      .input('ISVOWEL', apiHelper.getValueFromObject(body, 'is_vowel'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'desc'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('MD_LETTERS_CreateOrUpdate_AdminWeb');
    const letter_id = resultLetter.recordset[0].RESULT;

    if (letter_id > 0) {
      // removeCacheOptions();
      await transaction.commit();
    }
    return new ServiceResponse(true, '', letter_id);
  } catch (error) {
    logger.error(error, {
      function: 'letterService.addLetter',
    });
    console.error('letterService.addLetter', error);
    return new ServiceResponse(false, e.message);
  }
};
///////detail list letter
const detailLetter = async (letter_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('LETTERID', letter_id)
      .execute('MD_LETTER_GetById_AdminWeb');
    const Letter = data.recordset[0];
    // console.log(Account)
    if (Letter) {
      return new ServiceResponse(true, '', LetterClass.list(Letter));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'letterService.detailLetter',
    });

    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getLettersList,
  deleteLetter,
  addLetter,
  detailLetter,
  CheckLetter,
};
