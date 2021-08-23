const bannerClass = require('../banner/banner.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const stringHelper = require('../../common/helpers/string.helper');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'banner';
const config = require('../../../config/config');
const PLACEMENT = require('../../common/const/banner.const').PLACEMENT;
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const getListBanner = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('PLACEMENT', apiHelper.getValueFromObject(queryParams, 'placement', null))
      .execute(PROCEDURE_NAME.CMS_BANNER_GETLIST_ADMINWEB);
    const banners = data.recordset && data.recordset.length ? bannerClass.list(data.recordset) : [];
    return new ServiceResponse(true, '', {
      'data': banners.map((x) => ({...x, ...{placement: PLACEMENT.find(y=>x.placement === y.id)}})),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(data.recordset),
    });
  } catch (e) {
    logger.error(e, {'function': 'bannerService.getListBanner'});
    return new ServiceResponse(true, '', {});
  }
};

const detailBanner = async (banner_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BANNERID', banner_id)
      .execute(PROCEDURE_NAME.CMS_BANNER_GETBYID_ADMINWEB);

    let banner = data.recordset;

    if (banner && banner.length>0) {
      banner = bannerClass.detail(banner[0]);
      return new ServiceResponse(true, '', banner);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'bannerService.detailBanner'});
    return new ServiceResponse(false, e.message);
  }
};
const createBannerOrUpdate = async (bodyParams) => {
  let picture_url = apiHelper.getValueFromObject(bodyParams, 'picture_url');
  if (picture_url) {
    const path_picture_url = await saveFile(picture_url, folderName);
    if (path_picture_url) {
      picture_url = path_picture_url;
    }
  }
  console.log(picture_url)
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('BANNERID', apiHelper.getValueFromObject(bodyParams, 'banner_id'))
      .input('PICTUREALIAS', apiHelper.getValueFromObject(bodyParams, 'picture_alias'))
      .input('PICTUREURL', picture_url)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('PLACEMENT', apiHelper.getValueFromObject(bodyParams, 'placement'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_BANNER_CREATEORUPDATE_ADMINWEB);
    const banner_id = data.recordset[0].RESULT;
    return new ServiceResponse(true,'',banner_id);
  } catch (e) {
    logger.error(e, {'function': 'bannerService.createBannerOrUpdate'});
    return new ServiceResponse(false);
  }
};

const deleteBanner = async (banner_id, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('BANNERID', banner_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.CMS_BANNER_DELETE_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.BANNER.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'bannerService.deleteBanner'});
    return new ServiceResponse(false, e.message);
  }
};
const saveFile = async (base64, folderName) => {
  let url = null;

  try {
    if (fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      const guid = createGuid();
      url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extension}`);
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      'function': 'bannerService.saveFile',
    });
  }
  return url;
};
const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
module.exports = {
  getListBanner,
  detailBanner,
  deleteBanner,
  createBannerOrUpdate
};
