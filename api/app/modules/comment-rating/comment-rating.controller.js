const commentRatingService = require('./comment-rating.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list AM_COMPANY
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await commentRatingService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const auth_name = req.auth.user_name;
    const serviceRes = await commentRatingService.deleteById(
      req.params.id,
      auth_name
    );
    return res.json(new SingleResponse(serviceRes));
  } catch (error) {
    return next(error);
  }
};

const getImages = async (req, res, next) => {
  try {
    const serviceRes = await commentRatingService.getImages(req.params.id);
    return res.json(new SingleResponse(serviceRes));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getList,
  deleteById,
  getImages,
};
