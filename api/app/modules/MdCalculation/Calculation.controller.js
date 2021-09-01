const calculationService = require('./Calculation.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list MD_CALCULATION
 */
const getListCalculation = async (req, res, next) => {
  try {
    const serviceRes = await calculationService.getListCalculation(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteCalculation = async (req, res, next) => {
  try {
    const calculation_id = req.params.calculation_id;
    // Check exists
    const serviceResDetail = await calculationService.detailCalculation(
      calculation_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await calculationService.deleteCalculation(
      calculation_id,
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.CALCULATION.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Create
//  */
const createCalculation = async (req, res, next) => {
  try {
    req.body.calculation_id = null;
    const serviceRes = await calculationService.createCalculationOrUpdate(
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.CALCULATION.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Update
//  */
const updateCalculation = async (req, res, next) => {
  try {
    const calculation_id = req.params.calculation_id;
    req.body.calculation_id = calculation_id;

    // Check exists
    const serviceResDetail = await calculationService.detailCalculation(
      calculation_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes = await calculationService.createCalculationOrUpdate(
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.CALCULATION.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

const detailCalculation = async (req, res, next) => {
  try {
    const serviceRes = await calculationService.detailCalculation(
      req.params.calculation_id
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
  getListCalculation,
  deleteCalculation,
  createCalculation,
  updateCalculation,
  detailCalculation,
};
