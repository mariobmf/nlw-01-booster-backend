import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  return response.send('Initial Commit');
});

export default routes;
