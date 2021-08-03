/* eslint-disable no-await-in-loop */
const publishingComapanyClass = require('./publishing-company.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const savedFolder = 'publishing_company';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const { saveImage } = require('../../common/helpers/saveFile.helper');

const getList = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = queryParams.keyword || '';
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute('MD_PUBLISHINGCOMPANY_GetList');
    const lists = data.recordset;
    return new ServiceResponse(true, '', {
      data: publishingComapanyClass.list(lists),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(lists),
    });
  } catch (e) {
    logger.error(e, {
      function: 'PublishingCompany.getListAuthor',
    });
    return new ServiceResponse(true, '', {});
  }
};

const detail = async (Id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PUBLISHINGCOMPANYID', Id)
      .execute('MD_PUBLISHINGCOMPANY_GetById');
    let publishingCompany = data.recordset;
    // If exists MD_AREA
    if (publishingCompany && publishingCompany.length > 0) {
      publishingCompany = publishingComapanyClass.detail(publishingCompany[0]);
      return new ServiceResponse(true, '', publishingCompany);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { function: 'productCategoryService.detail' });
    return new ServiceResponse(false, e.message);
  }
};

const createOrUpdate = async (body = null) => {
  try {
    const {
      publishing_company_id = null,
      publishing_company_name = null,
      logo_image = null,
      is_active = null,
      notes = null,
      auth_name = null,
      publishing_company_quote = null,
    } = body;

    const pathLogo = await saveImage(savedFolder, logo_image);

    const pool = await mssql.pool;
    const { recordset } = await pool
      .request()
      .input('PUBLISHINGCOMPANYID', publishing_company_id)
      .input('PUBLISHINGCOMPANYNAME', publishing_company_name)
      .input('LOGOIMAGE', pathLogo)
      .input('ISACTIVE', is_active)
      .input('NOTES', notes)
      .input('PUBLISHINGCOMPANYQUOTE', publishing_company_quote)
      .input('CREATEDUSER', auth_name)
      .execute('MD_PUBLISHINGCOMPANY_CreateOrUpdate');
    if (recordset && recordset.length) {
      return {
        publishing_company_id: recordset[0]['PUBLISHINGCOMPANYID'],
      };
    }
    return new ServiceResponse(false, '');
  } catch (error) {
    logger.error(error, {
      function: 'PublishingCompanyService.createOrUpdate',
    });
    console.error('PublishingCompanyService.createOrUpdate', error);
    // Return error
    return new ServiceResponse(false, e.message);
  }
};

const deleteById = async (id, auth_name) => {
  const pool = await mssql.pool;
  try {
    const { recordset } = await pool
      .request()
      .input('PUBLISHINGCOMPANYID', id)
      .input('UPDATEDUSER', auth_name)
      .execute('MD_PUBLISHINGCOMPANY_Delete');
    if (recordset && recordset.length) {
      return new ServiceResponse(false, '', {
        result: recordset[0]['RESULT'],
      });
    }
  } catch (e) {
    logger.error(e, {
      function: 'PublishingCompanyService.delete',
    });
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  createOrUpdate,
  getList,
  detail,
  deleteById,
};
