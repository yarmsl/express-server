import {Schema, model} from 'mongoose';
import { UserInterface } from '../types/types';

const userSchema = new Schema<UserInterface>({
	email: {type: String, required: true, unique: true, index: true},
	password: {type: String, required: true},
	name: {type: String, default: ''},
	avatar: {type: String, default: '' },
	posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
});

export default model('User', userSchema);
