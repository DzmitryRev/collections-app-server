import { Router } from 'express';
import authRouter from './auth.router';
import userProfileRouter from './profile.router';

const rootRouter = Router();

rootRouter.use(authRouter);
rootRouter.use(userProfileRouter);

export default rootRouter;
