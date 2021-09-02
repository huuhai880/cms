const attributesService = require('./attributes.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list FOR_ATTRIBUTES
 */
const getListAtributes = async (req, res, next) => {
  try {
    const serviceRes = await attributesService.getListAttributes(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteAttributes = async (req, res, next) => {
  try {
    const attribute_id = req.params.attribute_id;
    // Check exists
    const serviceResDetail = await attributesService.detailAttributes(
      attribute_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await attributesService.deleteAttributes(
      attribute_id,
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.ATTRIBUTES.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createAttributes = async (req, res, next) => {
  try {
    req.body.attribute_id = null;
    const serviceRes = await attributesService.createAttributesOrUpdate(
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.ATTRIBUTES.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateAttributes = async (req, res, next) => {
  try {
    const attribute_id = req.params.attribute_id;
    req.body.attribute_id = attribute_id;

    // Check exists
    const serviceResDetail = await attributesService.detailAttributes(
      attribute_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes =
      await attributesService.createAttributesOrUpdate(
        req.body
      );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.ATTRIBUTES.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

const getOptionPartner = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_PARTNER', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionGroup = async (req, res, next) => {
  try {
    const serviceRes = await optionService('FOR_ATTRIBUTESGROUP', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionMainNumber = async (req, res, next) => {
  try {
    const serviceRes = await optionService('FOR_MAINNUMBER', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const detailAttributes = async (req, res, next) => {
  try {
    const serviceRes = await attributesService.detailAttributes(
      req.params.attribute_id
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
  getListAtributes,
  deleteAttributes,
  getOptionPartner,
  getOptionGroup,
  getOptionMainNumber,
  updateAttributes,
  createAttributes,
  detailAttributes,
};
