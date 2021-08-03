const express = require('express');
const validate = require('express-validation');
const routes = express.Router();
const {
  getList,
  createList,
  updateList,
  deleteImage,
} = require('./product-image.service');
const prefix = '/product-image';

// Change status
routes.get('/', async (req, res) => {
  const responseData = await getList(req.query);
  return res.json({ data: responseData });
});

routes.post('/', async (req, res) => {
  const responseData = await createList(req.body);
  return res.json(responseData);
});

routes.put('/', async (req, res) => {
  const responseData = await updateList(req.body);
  return res.json(responseData);
});

routes.delete('/:image_id', async (req, res) => {
  const responseData = await deleteImage(req.params);
  return res.json(responseData);
});

module.exports = {
  prefix,
  routes,
};
