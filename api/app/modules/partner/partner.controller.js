const partnerService = require('./partner.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_STORE
 */
const getListPartner = async (req, res, next) => {
  try {
    const serviceRes = await partnerService.getListPartner(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deletePartner = async (req, res, next) => {
  try {
    const partner_id = req.params.partner_id;
    // Check exists
    const serviceResDetail = await partnerService.detailPartner(partner_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await partnerService.deletePartner(partner_id, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.PARTNER.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createPartner = async (req, res, next) => {
  try {
    req.body.partner_id = null;
    const serviceRes = await partnerService.createPartnerOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.PARTNER.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updatePartner = async (req, res, next) => {
  try {
    const partner_id = req.params.partner_id;
    req.body.partner_id = partner_id;

    // Check exists
    const serviceResDetail = await partnerService.detailPartner(partner_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes = await partnerService.createPartnerOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.PARTNER.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail MD_PARTNER
 */
const detailPartner = async (req, res, next) => {
  try {
    const serviceRes = await partnerService.detailPartner(
      req.params.partner_id
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
  getListPartner,
  deletePartner,
  updatePartner,
  createPartner,
  detailPartner,
};
