const formulaService = require('./formula-by-dob.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list FOR_FORMULABYDOB
 */
const getListFormulaByDob = async (req, res, next) => {
  try {
    const serviceRes = await formulaService.getListFormulaByDob(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const deleteFormulaByDob = async (req, res, next) => {
  try {
    const formula_id = req.params.formula_id;
    // Check exists
    const serviceResDetail = await formulaService.detailFormulaByDob(
      formula_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete
    const serviceRes = await formulaService.deleteFormulaByDob(
      formula_id,
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.FORMULADOB.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createFormulaByDob = async (req, res, next) => {
  try {
    req.body.formula_id = null;
    const serviceRes = await formulaService.createFormulaByDobOrUpdate(
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.FORMULADOB.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateFormulaByDob = async (req, res, next) => {
  try {
    const formula_id = req.params.formula_id;
    req.body.formula_id = formula_id;

    // Check exists
    const serviceResDetail = await formulaService.detailFormulaByDob(
      formula_id
    );
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update
    const serviceRes =
      await formulaService.createFormulaByDobOrUpdate(
        req.body
      );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.FORMULADOB.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};

const getOptionParamdbo = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_PARAMDOB', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionAttributes = async (req, res, next) => {
  try {
    const serviceRes = await optionService('FOR_ATTRIBUTESGROUP', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionFormulaByDob = async (req, res, next) => {
  try {
    const serviceRes = await optionService('FOR_FORMULABYDOB', req.query);
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

const detailFormulaByDob = async (req, res, next) => {
  try {
    const serviceRes = await formulaService.detailFormulaByDob(
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
  getListFormulaByDob,
  deleteFormulaByDob,
  getOptionParamdbo,
  getOptionAttributes,
  getOptionFormulaByDob,
  getOptionCalculation,
  updateFormulaByDob,
  createFormulaByDob,
  detailFormulaByDob,
};
