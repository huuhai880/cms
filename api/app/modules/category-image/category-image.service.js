const mssql = require('../../models/mssql');
const { list } = require('./category-image.class');
const logger = require('../../common/classes/logger.class');
const { saveImage } = require('../../common/helpers/saveFile.helper');
const ServiceResponse = require('../../common/responses/service.response');
const { pool } = require('mssql');

const getList = async (query = {}) => {
  const pool = await mssql.pool;
  const { recordset, recordsets } = await pool
    .request()
    .input('PRODUCTCATEGORYID', query.product_category_id)
    .execute('PRO_CATEGORYPICTURE_GetList');
  const data = list(recordsets[0]);
  return new ServiceResponse(true, '', data);
};

const createList = async (body = {}) => {
  const { images, auth_name, product_category_id } = body;
  const savedPath = 'category_image';
  const pool = await mssql.pool;

  try {
    const data = await Promise.all(
      images.map(async (e) => {
        const picture_url = await saveImage(savedPath, e.picture_url);
        pool
          .request()
          .input('PICTUREURL', picture_url)
          .input('PRODUCTCATEGORYID', product_category_id)
          .input('ISDEFAULT', e.is_default)
          .input('CREATEDUSER', auth_name)
          .execute('PRO_CATEGORYPICTURE_CreateOrUpdate');
      })
    );
    return new ServiceResponse(true, 'Tạo nhiều hình ảnh thành công');
  } catch (e) {
    logger.error(e, {
      function: 'cateloryPictureService.createImageList',
    });
    return new ServiceResponse(flase, 'Tạo nhiều hình ảnh thất bại');
  }
};

const updateList = async (body = {}) => {
  const { images } = body;
  const pool = await mssql.pool;
  try {
    await Promise.all(
      images.map(async (e) => {
        pool
          .request()
          .input('CATEGORYPICTUREID', e.category_id)
          .input('ISDEFAULT', e.is_default)
          .execute('PRO_CATEGORYPICTURE_CreateOrUpdate');
      })
    );
    return new ServiceResponse(true, 'Thay đổi hình ảnh thành công');
  } catch (e) {
    logger.error(e, {
      function: 'cateloryPictureService.updateImageList',
    });
    return new ServiceResponse(flase, 'Thay đổi hình ảnh thất bại');
  }
};

const deleteImage = async (params) => {
  const { category_id } = params;
  const pool = await mssql.pool;
  try {
    await pool
      .request()
      .input('CATEGORYPICTUREID', category_id)
      .execute('PRO_CATEGORYPICTURE_Delete');
    return new ServiceResponse(true, 'Xoá hình thành công');
  } catch (e) {
    logger.error(e, {
      function: 'cateloryPictureService.deleteImage',
    });
    return new ServiceResponse(flase, 'Xoá hình ảnh thất bại');
  }
};

module.exports = {
  getList,
  createList,
  updateList,
  deleteImage,
};
