const httpStatus = require('http-status');
const RelationshipService = require('./relationship.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const addRelationship = async (req, res, next) => {
  try {
    // Insert Letter
    const serviceRes = await RelationshipService.addRelationship(req.body);
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
const getRelationshipsList = async (req, res, next) => {
  try {
    const serviceRes = await RelationshipService.getRelationshipsList(
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
const deleteRelationship = async (req, res, next) => {
  try {
    const relationships_id = req.params.relationships_id;

    const serviceRes = await RelationshipService.deleteRelationship(
      relationships_id,
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

const detailRelationship = async (req, res, next) => {
  // console.log(req.params)
  try {
    const relationships_id = req.params.relationships_id;

    // Check ACCOUNT exists
    const serviceRes = await RelationshipService.detailRelationship(
      relationships_id
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
const CheckRelationship = async (req, res, next) => {
  // console.log()
  try {
    // Check ACCOUNT exists
    const serviceRes = await RelationshipService.CheckRelationship(
      req.query.relationship
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
module.exports = {
  getRelationshipsList,
  deleteRelationship,
  CheckRelationship,
  detailRelationship,
  addRelationship,
};
