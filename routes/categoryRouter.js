import express from 'express';
const categoryRouter = express.Router();
import * as categoryController from '../controllers/categoryController.js';

categoryRouter.get('/categories', categoryController.showAllCategories);

export default categoryRouter;
