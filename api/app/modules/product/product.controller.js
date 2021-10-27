const productService = require('./product.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');


const getListProduct = async (req, res, next) => {
  try {
    const serviceRes = await productService.getListProduct(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


const detailProduct = async (req, res, next) => {
  try {
    const productId = req.params.product_id;
    const serviceRes = await productService.detailProduct(productId);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
const getListInterPretAttributesGroup = async (req, res, next) => {
  try {
    const serviceRes = await productService.getListInterPretAttributesGroup(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const serviceRes = await productService.createProduct(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.PRODUCT.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};



const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.product_id;
    req.body.product_id = productId;

    const serviceRes = await productService.updateProduct(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.PRODUCT.UPDATE_SUCCESS
      )
    );
  } catch (error) {
    return next(error);
  }
};


const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.product_id;
    const serviceRes = await productService.deleteProduct(productId, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.PRODUCT.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(error);
  }
};


const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await productService.getOptions(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceResDetail);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


const getListAttributesGroup = async (req, res, next) => {
  try {
    const serviceRes = await productService.getListAttributesGroup();
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListProduct,
  detailProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getOptions,
  getListAttributesGroup,
  getListInterPretAttributesGroup
};
