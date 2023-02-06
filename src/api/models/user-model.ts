import {Schema, model, type Model, type Document, Error, CallbackError} from 'mongoose';
import {DEFAULT_IMAGE} from '../../utils/constants';

export type UserType = {
	photo: string;
	name: string;
	email: string;
	password: string;
	about: string;
	isConfirmed: boolean;
	activationLink: string;
	isBlocked: boolean;
	isAdmin: boolean;
};

type UserDtoType = {id: string} & Pick<
UserType,
'name' | 'about' | 'photo' | 'email' | 'isAdmin' | 'isBlocked' | 'isConfirmed'
>;

type UserMethodsType = {
	transform(): UserDtoType;
} & UserType &
Document;

type UserModelType = {
	get(id: string): UserType;
} & Model<UserMethodsType>;

const userSchema = new Schema<UserType, UserModelType, UserMethodsType>({
	email: {type: String, unique: true, required: true, trim: true},
	name: {type: String, required: true, trim: true},
	password: {type: String, required: true, minlength: 6},
	photo: {type: String, default: DEFAULT_IMAGE},
	about: {type: String},
	isConfirmed: {type: Boolean, default: false},
	activationLink: {type: String},
	isBlocked: {type: Boolean, default: false},
	isAdmin: {type: Boolean, default: false},
});

// Hash password before saving user to db
userSchema.pre('save', async function (next) {
	try {
		if (!this.isModified('password')) {
			next();
			return;
		}

		// Const hash = await bcrypt.hash(this.password, Number(saltRound));
		// this.password = hash;
		next();
		return;
	} catch (err) {
		next(err);
	}
});

// Transform user to DTO
userSchema.methods.transform = function () {
	const userDto: UserDtoType = {
		id: this.id as string,
		name: this.name,
		email: this.email,
		photo: this.photo,
		about: this.about,
		isConfirmed: this.isConfirmed,
		isBlocked: this.isBlocked,
		isAdmin: this.isAdmin,
	};
	return userDto;
};

// Transform user to DTO
userSchema.methods.token = function () {
	// Generate token
	return 'token';
};

// Get user
userSchema.statics.get = async function (id: string) {
	// API error check
	const user = this.findById(id);
	// API error check
	return user;
};

const user = model<UserType, UserModelType>('User', userSchema);

export default user;
