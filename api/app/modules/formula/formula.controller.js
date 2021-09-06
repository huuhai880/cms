const formulaService = require('./formula.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list FOR_ATTRIBUTES
 */
const getListFormula = async (req, res, next) => {
  try {
    const serviceRes = await formulaService.getListFormula(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteFormula = async (req, res, next) => {
  try {
    const formula_id = req.params.formula_id;
    // Check exists
    const serviceResDetail = await formulaService.detailFormula(
      formula_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await formulaService.deleteFormula(
      formula_id,
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.FORMULA.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createFormula = async (req, res, next) => {
  try {
    req.body.formula_id = null;
    const serviceRes = await formulaService.createFormulaOrUpdate(
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.FORMULA.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateFormula = async (req, res, next) => {
  try {
    const formula_id = req.params.formula_id;
    req.body.formula_id = formula_id;

    // Check exists
    const serviceResDetail = await formulaService.detailFormula(
      formula_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes =
      await formulaService.createFormulaOrUpdate(
        req.body
      );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.FORMULA.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

const getOptionAttributes = async (req, res, next) => {
  try {
    const serviceRes = await optionService('FOR_ATTRIBUTES', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionFormula = async (req, res, next) => {
  try {
    const serviceRes = await optionService('FOR_FORMULA', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionCalculation = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_CALCULATION', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const detailFormula = async (req, res, next) => {
  try {
    const serviceRes = await formulaService.detailFormula(
      req.params.formula_id
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
  getListFormula,
  deleteFormula,
  getOptionAttributes,
  getOptionFormula,
  getOptionCalculation,
  updateFormula,
  createFormula,
  detailFormula,
};
