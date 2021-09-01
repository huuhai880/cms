const httpStatus = require('http-status');
const LetterService = require('./letter.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const addLetter = async (req, res, next) => {
  try {
    // Insert Letter
    const serviceRes = await LetterService.addLetter(req.body);
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
const getLettersList = async (req, res, next) => {
  try {
    const serviceRes = await LetterService.getLettersList(req.query);
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
const deleteLetter = async (req, res, next) => {
  try {
    const letter_id = req.params.letter_id;

    const serviceRes = await LetterService.deleteLetter(letter_id, req.body);
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

const detailLetter = async (req, res, next) => {
  try {
    const letter_id = req.params.letter_id;

    // Check ACCOUNT exists
    const serviceRes = await LetterService.detailLetter(letter_id);
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
const CheckLetter = async (req, res, next) => {
  // console.log()
  try {
    // Check ACCOUNT exists
    const serviceRes = await LetterService.CheckLetter(req.query.letter);
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
module.exports = {
  getLettersList,
  deleteLetter,
  addLetter,
  detailLetter,
  CheckLetter,
};
