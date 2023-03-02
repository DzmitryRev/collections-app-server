import { Router } from 'express';
import authRouter from './auth.router';
import collectionRouter from './collection.router';
import userProfileRouter from './profile.router';

const rootRouter = Router();

rootRouter.use(authRouter);
rootRouter.use(userProfileRouter);
rootRouter.use(collectionRouter);

export default rootRouter;
