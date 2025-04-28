const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/cartController');

categoryRouter.get('/', categoryController.showAllCategories);

module.exports = categoryRouter;
