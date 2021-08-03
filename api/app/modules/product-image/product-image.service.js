const mssql = require('../../models/mssql');
const { list } = require('./product-image.class');
const logger = require('../../common/classes/logger.class');
const { saveImage } = require('../../common/helpers/saveFile.helper');
const ServiceResponse = require('../../common/responses/service.response');

const getList = async (query = {}) => {
  const pool = await mssql.pool;
  const { recordset, recordsets } = await pool
    .request()
    .input('PRODUCTID', query.product_id)
    .execute('PRO_PRODUCTPICTURE_GetList');
  const data = list(recordsets[0]);
  return new ServiceResponse(true, '', data);
};

const createList = async (body = {}) => {
  const { images, auth_name, product_id } = body;
  const savedPath = 'product_image';
  const pool = await mssql.pool;

  try {
    const data = await Promise.all(
      images.map(async (e) => {
        const picture_url = await saveImage(savedPath, e.picture_url);
        pool
          .request()
          .input('PICTUREURL', picture_url)
          .input('PRODUCTID', product_id)
          .input('ISDEFAULT', e.is_default)
          .input('CREATEDUSER', auth_name)
          .execute('PRO_PRODUCTIMAGES_CreateOrUpdate');
      })
    );
    return new ServiceResponse(true, 'Tạo nhiều hình ảnh thành công');
  } catch (e) {
    logger.error(e, {
      function: 'productPictureService.createImageList',
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
          .input('PRODUCTIMAGEID', e.product_picture_id)
          .input('ISDEFAULT', e.is_default)
          .execute('PRO_PRODUCTIMAGES_CreateOrUpdate');
      })
    );
    return new ServiceResponse(true, 'Thay đổi hình ảnh thành công');
  } catch (e) {
    logger.error(e, {
      function: 'productPictureService.updateImageList',
    });
    return new ServiceResponse(flase, 'Thay đổi hình ảnh thất bại');
  }
};

const deleteImage = async (params) => {
  const { image_id } = params;
  const pool = await mssql.pool;
  try {
    await pool
      .request()
      .input('PRODUCTPICTUREID', image_id)
      .execute('PRO_PRODUCTPICTURE_Delete');
    return new ServiceResponse(true, 'Xoá hình thành công');
  } catch (e) {
    logger.error(e, {
      function: 'productPictureService.deleteImage',
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
