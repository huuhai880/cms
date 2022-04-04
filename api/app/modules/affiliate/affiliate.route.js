const express = require('express');
const validate = require('express-validation');
const affiliateController = require('./affiliate.controller');
const routes = express.Router();
const prefix = '/affiliate';
const rule = require('./affiliate.rule')

routes.route('/')
    .get(affiliateController.getListAffiliate)
    .post(validate(rule.createAff), affiliateController.createOrUpdateAff)

routes.route('/option')
    .get(affiliateController.getOption)

routes.route('/init')
    .get(affiliateController.initDataOption)

routes.route('/:id(\\d+)')
    .get(affiliateController.getDetailAffiliate);

routes.route('/up-level')
    .post(validate(rule.upLevelAff), affiliateController.upLevelAffiliate)

routes.route('/report')
    .get(affiliateController.reportOfAffiliate);

routes.route('/order')
    .get(affiliateController.getListOrderAff);

routes.route('/customer')
    .get(affiliateController.getListCustomerAff);

routes.route('/member')
    .get(affiliateController.getListMemberAff);

routes.route('/request')
    .get(affiliateController.getListAffRequest);

routes.route('/request/:id(\\d+)')
    .get(affiliateController.getDetailAffRequest);

routes.route('/request/reject')
    .post(affiliateController.rejectAffRequest);

routes.route('/request/approve')
    .post(affiliateController.approveAffRequest);


module.exports = {
    prefix,
    routes,
};

