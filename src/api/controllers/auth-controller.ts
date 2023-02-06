import {type Request, type NextFunction, type Response} from 'express';
import authService from '../services/auth-service';

class AuthController {
	async register(req, res, next) {
		try {
		} catch (err) {}
	}

	async login(req: Request<Record<string, unknown>, {email: string; password: string}>, res: Response, next: NextFunction) {
		try {
			const data = await authService.login(req.body);
			res.status(200).json({data, success: 'SUCCESS'});
		} catch (err) {
			next(err);
		}
	}
}

export default new AuthController();
