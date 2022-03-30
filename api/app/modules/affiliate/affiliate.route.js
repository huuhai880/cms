const express = require('express');
const validate = require('express-validation');
const affiliateController = require('./affiliate.controller');
const routes = express.Router();
const prefix = '/affiliate';
const rule = require('./affiliate.rule')

routes.route('/')
    .get(affiliateController.getListAffiliate)
    .post(validate(rule.createAff), affiliateController.createAff)

routes.route('/option')
    .get(affiliateController.getOption)

routes.route('/init')
    .get(affiliateController.init)


module.exports = {
    prefix,
    routes,
};

