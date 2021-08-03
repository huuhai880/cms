const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const commentRatingClass = require('./comment-rating.class');

/**
 * Get list AM_COMPANY
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getList = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

    const { keyword = '', is_active = '', rating = 0 } = queryParams;

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('ISACTIVE', is_active)
      .input('RATING', rating)
      .execute('CRM_COMMENTRATING_GetList');

    const { recordset } = data;
    return new ServiceResponse(true, '', {
      data: commentRatingClass.list(recordset),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(recordset),
    });
  } catch (e) {
    logger.error(e, { function: 'commentRating.getList' });
    return new ServiceResponse(true, '', {});
  }
};

const deleteById = async (id, auth_name) => {
  const pool = await mssql.pool;
  try {
    const { recordset } = await pool
      .request()
      .input('COMMENTRATINGID', id)
      .input('UPDATEDUSER', auth_name)
      .execute('CRM_COMMENTRATING_Delete');
    if (recordset && recordset.length) {
      return new ServiceResponse(true, '', {
        result: recordset[0]['RESULT'],
      });
    } else {
      throw new Error('Not found id');
    }
  } catch (e) {
    logger.error(e, {
      function: 'commentRating.delete',
    });
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};

const getImages = async (id) => {
  const pool = await mssql.pool;
  try {
    const { recordset } = await pool
      .request()
      .input('COMMENTRATINGID', id)
      .execute('CRM_COMMENTRATING_GetImages_AdminWeb');
    return new ServiceResponse(
      true,
      '',
      commentRatingClass.listImage(recordset)
    );
  } catch (e) {
    logger.error(e, {
      function: 'commentRating.getListImages',
    });
    await transaction.rollback();
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getList,
  deleteById,
  getImages,
};
