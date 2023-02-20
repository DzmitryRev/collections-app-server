import { Router } from 'express';
import authRouter from './auth.routers';

const rootRouter = Router();

rootRouter.use(authRouter);

export default rootRouter;
