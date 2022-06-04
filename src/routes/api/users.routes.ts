import { Router } from 'express';

import * as control from '../../controllers/users.controllers';
import authenticationMiddleware from '../../middleware/authenticate.middleware';

const routes = Router();

routes
  .route('/')
  .get(authenticationMiddleware, control.getMany)
  .post(control.create);
routes
  .route('/:id')
  .get(control.getOne)
  .patch(control.updateOne)
  .delete(control.deleteOne);

routes.route('/authenticate').post(control.authenticate);
export default routes;
