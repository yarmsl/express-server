import {Schema, model, Types} from 'mongoose';
import { UserInterface } from '../types/types';

const schema = new Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	posts: [{type: Types.ObjectId, ref: 'Link'}]
});

export default model<UserInterface>('User', schema);