const ConfigService = require('./app-config.service');
const SingleResponse = require('../../common/responses/single.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

// Lay danh sach vi tri dat banner 
const getListPlacementForBanner = async (req, res, next) => {
  try {
    const serviceRes = await ConfigService.getListPlacementForBanner();
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getListPageConfig = async (req, res, next) => {
  try {
    const serviceRes = await ConfigService.getListPageConfig();
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getPageConfig = async (req, res, next) => {
  try {
    const serviceRes = await ConfigService.getPageConfig(req.params.page);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updatePageConfig = async (req, res, next) => {
  try {
    const serviceRes = await ConfigService.updatePageConfig(Object.assign({}, req.params, { configs: req.body}));
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getListPlacementForBanner,
  getListPageConfig,
  getPageConfig,
  updatePageConfig
};
