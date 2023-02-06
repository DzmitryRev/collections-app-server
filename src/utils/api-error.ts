import {INTERNAL_SERVER_ERROR} from './constants';

type ApiErrorPropsType = {
	message: string;
	stack: string;
	errors: string[];
	status: number;
};

class ApiError extends Error {
	errors: string[];
	status: number;

	constructor({
		message,
		stack,
		errors = [],
		status = INTERNAL_SERVER_ERROR,
	}: ApiErrorPropsType) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errors = errors;
		this.status = status;
		this.stack = stack;
	}
}

export default ApiError;
