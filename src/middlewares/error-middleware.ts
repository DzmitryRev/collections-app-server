import {type NextFunction, type Request, type Response} from 'express';
import ApiError from '../utils/api-error';
import {INTERNAL_SERVER_ERROR} from '../utils/constants';

function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
	if (err instanceof ApiError) {
		return res.status(err.status).json({message: err.message, errors: err.errors});
	}

	return res.status(INTERNAL_SERVER_ERROR).json({message: 'Непредвиденная ошибка'});
}

export default errorMiddleware;
