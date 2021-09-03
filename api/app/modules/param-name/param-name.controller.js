const paramNameService = require('./param-name.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_PARAMNAME
 */
const getListParamName = async (req, res, next) => {
  try {
    const serviceRes = await paramNameService.getListParamName(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteParamName = async (req, res, next) => {
  try {
    const param_name_id = req.params.param_name_id;
    // Check exists
    const serviceResDetail = await paramNameService.detailParamName(
      param_name_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await paramNameService.deleteParamName(
      param_name_id,
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.PARAMNAME.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createParamName = async (req, res, next) => {
  try {
    req.body.param_name_id = null;
    const serviceRes = await paramNameService.createParamNameOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.PARAMNAME.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateParamName = async (req, res, next) => {
  try {
    const param_name_id = req.params.param_name_id;
    req.body.param_name_id = param_name_id;

    // Check exists
    const serviceResDetail = await paramNameService.detailParamName(
      param_name_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes = await paramNameService.createParamNameOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.PARAMNAME.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

const detailParamName = async (req, res, next) => {
  try {
    const serviceRes = await paramNameService.detailParamName(
      req.params.param_name_id
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
}
};

module.exports = {
  getListParamName,
  deleteParamName,
  createParamName,
  updateParamName,
  detailParamName,
};
