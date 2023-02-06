import User from '../models/user-model';

class AuthService {
	async register() {
		try {
			const user = new User();
			const savedUser = await user.save();
			return {token: user.token(), user: savedUser.transform()};
		} catch (err) {

		}
	}

	async login() {
		const {user, accessToken} = await User.ValidateUserAndGenerateToken(userData);
		const tokens = generateTokenResponse(user, accessToken);
		return {tokens, user};
	}
}

export default new AuthService();
