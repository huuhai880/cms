const formulaByNameService = require('./formula-by-name.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list FOR_ATTRIBUTES
 */
const getListFormulaByName = async (req, res, next) => {
  try {
    const serviceRes = await FormulaByName.getListFormulaByName(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteFormulaByName = async (req, res, next) => {
  try {
    const formula_id = req.params.formula_id;
    // Check exists
    const serviceResDetail = await FormulaByName.detailFormulaByName(
      formula_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await FormulaByName.deleteFormulaByName(
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
const createFormulaByName = async (req, res, next) => {
  try {
    req.body.formula_id = null;
    const serviceRes = await FormulaByName.createFormulaByNameOrUpdate(
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
const updateFormulaByName = async (req, res, next) => {
  try {
    const formula_id = req.params.formula_id;
    req.body.formula_id = formula_id;

    // Check exists
    const serviceResDetail = await FormulaByName.detailFormulaByName(
      formula_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes = await FormulaByName.createFormulaByNameOrUpdate(
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

const getOptionLetter = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_LETTERS', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionFormulaByName = async (req, res, next) => {
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

const detailFormulaByName = async (req, res, next) => {
  try {
    const serviceRes = await FormulaByName.detailFormulaByName(
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
  getListFormulaByName,
  deleteFormulaByName,
  getOptionAttributes,
  getOptionLetter,
  getOptionFormulaByName,
  getOptionCalculation,
  updateFormulaByName,
  createFormulaByName,
  detailFormulaByName,
};
