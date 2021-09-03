const attributesGroupService = require('./attributes-group.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_ATTRIBUTESGROUP
 */
const getListAttributesGroup = async (req, res, next) => {
  try {
    const serviceRes = await attributesGroupService.getListAttributesGroup(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteAttributesGroup = async (req, res, next) => {
  try {
    const attributes_group_id = req.params.attributes_group_id;
    // Check exists
    const serviceResDetail = await attributesGroupService.detailAttributesGroup(
      attributes_group_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await attributesGroupService.deleteAttributesGroup(
      attributes_group_id,
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.ATTRIBUTESGROUP.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Create
//  */
const createAttributesGroup = async (req, res, next) => {
  try {
    req.body.attributes_group_id = null;
    const serviceRes = await attributesGroupService.createAttributesGroupOrUpdate(
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.ATTRIBUTESGROUP.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Update
//  */
const updateAttributesGroup = async (req, res, next) => {
  try {
    const attributes_group_id = req.params.attributes_group_id;
    req.body.attributes_group_id = attributes_group_id;

    // Check exists
    const serviceResDetail = await attributesGroupService.detailAttributesGroup(
      attributes_group_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes = await attributesGroupService.createAttributesGroupOrUpdate(
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.ATTRIBUTESGROUP.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

const detailAttributesGroup = async (req, res, next) => {
  try {
    const serviceRes = await attributesGroupService.detailAttributesGroup(
      req.params.attributes_group_id
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
  getListAttributesGroup,
  deleteAttributesGroup,
  createAttributesGroup,
  updateAttributesGroup,
  detailAttributesGroup,
};
