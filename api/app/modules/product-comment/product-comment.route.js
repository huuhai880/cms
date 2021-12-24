const express = require('express');
const productCommentController = require('./product-comment.controller');
const routes = express.Router();
const prefix = '/product-comment';

routes.route('/')
    .get(productCommentController.getListComment)
    .post(productCommentController.replyComment);

routes
    .route('/:product_comment_id(\\d+)')
    .put(productCommentController.reviewComment)
    .delete(productCommentController.deleteComment)

module.exports = {
    prefix,
    routes,
};