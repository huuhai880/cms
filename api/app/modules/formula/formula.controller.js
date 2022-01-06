const httpStatus = require('http-status');
const FormulaService = require('./formula.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const addFormula = async (req, res, next) => {
  try {
    // Insert Formula
    const serviceRes = await FormulaService.addFormula(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.ACCOUNT.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};
const getFormulaList = async (req, res, next) => {
  try {
    // console.log("req.query")
    const serviceRes = await FormulaService.getFormulaList(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};
const deleteFormula = async (req, res, next) => {
  try {
    const formula_id = req.params.formula_id;

    const serviceRes = await FormulaService.deleteFormula(formula_id, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(null, RESPONSE_MSG.COMMENT.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};

const detailFormula = async (req, res, next) => {
  try {
    const formula_id = req.params.formula_id;

    // Check ACCOUNT exists
    const serviceRes = await FormulaService.detailFormula(formula_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};
// const CheckFormula = async (req, res, next) => {
//   // console.log()
//   try {
//     // Check ACCOUNT exists
//     const serviceRes = await FormulaService.CheckFormula(req.query.Formula);
//     if (serviceRes.isFailed()) {
//       return next(serviceRes);
//     }
//     return res.json(new SingleResponse(serviceRes.getData()));
//   } catch (error) {
//     return next(
//       new ErrorResponse(
//         httpStatus.NOT_IMPLEMENTED,
//         error,
//         RESPONSE_MSG.REQUEST_FAILED
//       )
//     );
//   }
// };
const getIngredientList = async (req, res, next) => {
  try {
    const serviceRes = await FormulaService.getIngredientList(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data } = serviceRes.getData();
    return res.json(new ListResponse(data));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};
const GetListCalculation = async (req, res, next) => {
  try {
    const serviceRes = await FormulaService.GetListCalculation(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data } = serviceRes.getData();
    return res.json(new ListResponse(data));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};
const GetListFormulaParent = async (req, res, next) => {
  try {
    const serviceRes = await FormulaService.GetListFormulaParent(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data } = serviceRes.getData();
    return res.json(new ListResponse(data));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};
const GetListAttributeGruop = async (req, res, next) => {
  try {
    const serviceRes = await FormulaService.GetListAttributeGruop(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data } = serviceRes.getData();
    return res.json(new ListResponse(data));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};
module.exports = {
  getFormulaList,
  GetListFormulaParent,
  GetListCalculation,
  getIngredientList,
  GetListAttributeGruop,
  deleteFormula,
  addFormula,
  detailFormula,
  // CheckFormula,
};
