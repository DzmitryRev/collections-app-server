import {INTERNAL_SERVER_ERROR} from './constants';

type ApiErrorPropsType = {
	message: string;
	errors: string[];
	status: number;
};

class ApiError extends Error {
	errors: string[];
	status: number;

	constructor({
		message,
		errors = [],
		status = INTERNAL_SERVER_ERROR,
	}: ApiErrorPropsType) {
		super(message);
		this.errors = errors;
		this.status = status;
	}
}

export default ApiError;
