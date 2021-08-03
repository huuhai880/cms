const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');
const PublishingCompanyService = require('./publishing-company.service');
const ListResponse = require('../../common/responses/list.response');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await PublishingCompanyService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const detail = async (req, res, next) => {
  try {
    const serviceRes = await PublishingCompanyService.detail(req.params.id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const data = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list options position
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_PUBLISHINGCOMPANY', req.query);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);  
  }
};

const createOrUpdate = async (req, res, next) => {
  try {
    if (req.params && req.params.id)
      req.body.publishing_company_id = req.params.id;
    const serviceRes = await PublishingCompanyService.createOrUpdate(req.body);
    return res.json(new SingleResponse(serviceRes));
  } catch (error) {
    return next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const auth_name = req.auth.user_name;
    const serviceRes = await PublishingCompanyService.deleteById(
      req.params.id,
      auth_name
    );
    return res.json(new SingleResponse(serviceRes));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getList,
  detail,
  getOptions,
  createOrUpdate,
  deleteById,
};
