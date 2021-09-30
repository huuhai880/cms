const httpStatus = require('http-status');
const interpretService = require('./interpret.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getInterpretsList = async (req, res, next) => {
  try {
    const serviceRes = await interpretService.getInterpretsList(req.query);
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

const getDetailListByInterpret = async (req, res, next) => {
  try {
    const serviceRes = await interpretService.getDetailListByInterpret(
      req.query
    );
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

const getMainNumberList = async (req, res, next) => {
  try {
    const serviceRes = await interpretService.getMainNumberList(req.query);
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

const getAttributesList = async (req, res, next) => {
  try {
    const serviceRes = await interpretService.getAttributesList(req.query);
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

const getListInterpretParent = async (req, res, next) => {
  try {
    const { interpret_id, interpret_detail_id } = req.params;
    const serviceRes = await interpretService.getListInterpretParent(
      interpret_id,
      interpret_detail_id
    );
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

const getRelationshipsList = async (req, res, next) => {
  try {
    const serviceRes = await interpretService.getRelationshipsList(req.query);
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

const addIntergretDetail = async (req, res, next) => {
  try {
    const serviceRes = await interpretService.addIntergretDetail(req.body);
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

const addIntergret = async (req, res, next) => {
  try {
    const serviceRes = await interpretService.addIntergret(req.body);
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

const detaiIntergret = async (req, res, next) => {
  try {
    const interpret_id = req.params.interpret_id;
    const serviceRes = await interpretService.detaiIntergret(interpret_id);
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

const detaiDetailInterpret = async (req, res, next) => {
  try {
    const interpret_detail_id = req.params.interpret_detail_id;
    const serviceRes = await interpretService.detaiDetailInterpret(
      interpret_detail_id
    );
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


const deleteInterpret = async (req, res, next) => {
  try {
    const interpret_id = req.params.interpret_id;
    const serviceRes = await interpretService.deleteInterpret(
      interpret_id,
      req.body
    );
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

const deleteDetailInterpret = async (req, res, next) => {
  try {
    const interpret_detail_id = req.params.interpret_detail_id;
    const serviceRes = await interpretService.deleteDetailInterpret(
      interpret_detail_id,
      req.body
    );
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

const CheckDetailInterpret = async (req, res, next) => {
  try {
    const serviceRes = await interpretService.CheckDetailInterpret(
      req.query.interpret_detail_name
    );
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


const getListAttributeExcludeById = async (req, res, next) => {
  try {
    const { attribute_id, interpret_id } = req.params;
    const serviceRes = await interpretService.getListAttributeExcludeById(attribute_id, interpret_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const copyIntergret = async (req, res, next) => {
  try {
    const serviceRes = await interpretService.copyIntergret(req.body);
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


module.exports = {
  getMainNumberList,
  getAttributesList,
  getRelationshipsList,
  addIntergret,
  detaiIntergret,
  getInterpretsList,
  deleteInterpret,
  getDetailListByInterpret,
  deleteDetailInterpret,
  getListInterpretParent,
  addIntergretDetail,
  CheckDetailInterpret,
  detaiDetailInterpret,
  getListAttributeExcludeById,
  copyIntergret
};
