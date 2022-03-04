const express = require('express');
const validate = require('express-validation');
const pageController = require('./page.controller');
const routes = express.Router();
const rules = require('./page.rule');
const prefix = '/page';

routes.route('/')
    .get(pageController.getListpage)
    .post(validate(rules.createUpdatePage), pageController.createOrUpdatePage)

routes
    .route('/:page_id(\\d+)')
    .get(pageController.detailPage)
    .delete(pageController.deletePage)


module.exports = {
    prefix,
    routes,
};