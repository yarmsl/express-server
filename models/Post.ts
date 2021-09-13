import {Schema, model, Types} from 'mongoose';
import { PostInterface } from '../types/types';

const postSchema = new Schema({
	author: {type: Types.ObjectId, ref: 'User'},
	title: {type: String, required: true},
	text: {type: String, required: true},
	date: {type: Date, default: Date.now }
});

export default model<PostInterface>('Post', postSchema);