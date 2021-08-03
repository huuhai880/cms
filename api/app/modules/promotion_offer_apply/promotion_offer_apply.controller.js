const promotionOfferApplyService = require('../promotion_offer_apply/promotion_offer_apply.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list CRM_SEGMENT
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await promotionOfferApplyService.getListByPromotionId(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getList,
};
