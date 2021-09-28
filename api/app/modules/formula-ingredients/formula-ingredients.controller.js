const httpStatus = require('http-status');
const IngredientService = require('./formula-ingredients.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const addIngredient = async (req, res, next) => {
  try {
    // Insert Letter
    const serviceRes = await IngredientService.addIngredient(req.body);
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
const getParamName = async (req, res, next) => {
  try {
    const serviceRes = await IngredientService.getParamName(req.query);
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
const GetListParamDob = async (req, res, next) => {
  try {
    const serviceRes = await IngredientService.GetListParamDob(req.query);
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
    const serviceRes = await IngredientService.GetListCalculation(req.query);
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
const getIngredientList = async (req, res, next) => {
  try {
    const serviceRes = await IngredientService.getIngredientList(req.query);
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
const getIngredientsList = async (req, res, next) => {
  try {
    const serviceRes = await IngredientService.getIngredientsList(req.query);
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
// const deleteLetter = async (req, res, next) => {
//   try {
//     const letter_id = req.params.letter_id;

//     const serviceRes = await IngredientService.deleteLetter(letter_id, req.body);
//     if (serviceRes.isFailed()) {
//       return next(serviceRes);
//     }

//     return res.json(
//       new SingleResponse(null, RESPONSE_MSG.COMMENT.DELETE_SUCCESS)
//     );
//   } catch (error) {
//     return next(error);
//   }
// };

const detailIngredient = async (req, res, next) => {
  try {
    const ingredient_id = req.params.ingredient_id;

    // Check ACCOUNT exists
    const serviceRes = await IngredientService.detailIngredient(ingredient_id);
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
// const CheckLetter = async (req, res, next) => {
//   // console.log()
//   try {
//     // Check ACCOUNT exists
//     const serviceRes = await IngredientService.CheckLetter(req.query.letter);
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
module.exports = {
  getIngredientsList,
  GetListCalculation,
  getParamName,
  GetListParamDob,
  // deleteLetter,
  addIngredient,
  detailIngredient,
  getIngredientList,
  // CheckLetter,
};
