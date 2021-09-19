const searchHistoryService = require('./search-history.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list FOR_ATTRIBUTES
 */
const getListSearchHistory = async (req, res, next) => {
  try {
    const serviceRes = await searchHistoryService.getListSearchHistory(
      req.query
    );
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteSearchHistory = async (req, res, next) => {
  try {
    const member_id = req.params.member_id;
    // Check exists
    const serviceResDetail = await searchHistoryService.detailSearchHistory(
      member_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await searchHistoryService.deleteSearchHistory(
      member_id,
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.SEARCHHISTORY.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

const detailSearchHistory = async (req, res, next) => {
  try {
    const serviceRes = await searchHistoryService.detailSearchHistory(
      req.params.member_id
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const detailSearchHistoryproduct = async (req, res, next) => {
  let queryParams = req.query;
  try {
    const serviceRes = await searchHistoryService.detailSearchHistoryproduct(
      req.params.member_id,
      queryParams
    );
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListSearchHistory,
  deleteSearchHistory,
  detailSearchHistory,
  detailSearchHistoryproduct,
};
