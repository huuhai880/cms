const bannerService = require('./banner.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list
 */
const getListBanner = async (req, res, next) => {
  try {
    const serviceRes = await bannerService.getListBanner(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailBanner = async (req, res, next) => {
  try {
    const serviceRes = await bannerService.detailBanner(req.params.banner_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
/**
 * Create new a 
 */
const createBanner = async (req, res, next) => {
  try {
    req.body.banner_id = null;
    const serviceRes = await bannerService.createBannerOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BANNER.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a banner
 */
const updateBanner = async (req, res, next) => {
  try {
    const banner_id = req.params.banner_id;
    req.body.banner_id = banner_id;

    // Check banner exists
    const serviceResDetail = await bannerService.detailBanner(banner_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update banner
    const serviceRes = await bannerService.createBannerOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BANNER.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteBanner = async (req, res, next) => {
  try {
    const banner_id = req.params.banner_id;

    // Check banner exists
    const serviceResDetail = await bannerService.detailBanner(banner_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete banner
    const serviceRes = await bannerService.deleteBanner(banner_id, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.BANNER.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getListBanner,
  detailBanner,
  deleteBanner,
  createBanner,
  updateBanner
};
