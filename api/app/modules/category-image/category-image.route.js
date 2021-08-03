const express = require('express');
const validate = require('express-validation');
const routes = express.Router();
const {
  getList,
  createList,
  updateList,
  deleteImage,
} = require('./category-image.service');
const rules = require('./category-image.rule');

const prefix = '/category-image';

// Get List
routes.get('/', async (req, res) => {
  const responseData = await getList(req.query);
  return res.json({ data: responseData });
});

// Create Image
routes.post('/', validate(rules.create), async (req, res) => {
  const responseData = await createList(req.body);
  return res.json(responseData);
});

routes.put('/', validate(rules.update), async (req, res) => {
  const responseData = await updateList(req.body);
  return res.json(responseData);
});

routes.delete('/:category_id', async (req, res) => {
  const responseData = await deleteImage(req.params);
  return res.json(responseData);
});

module.exports = {
  prefix,
  routes,
};
