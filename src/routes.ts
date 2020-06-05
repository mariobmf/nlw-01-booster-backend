import { Router } from 'express';

import ItemController from './controllers/ItemController';

const routes = Router();

routes.get('/items', ItemController.index);

export default routes;
