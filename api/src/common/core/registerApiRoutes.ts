// TypeScript
import type { Application, Router } from 'express';

const registerApiRoutes = (app: Application, routes: Router): void => {
  app.use('/api', routes);
};

export default registerApiRoutes;

