import {Document, Schema} from 'mongoose';

export interface UserInterface extends Document {
	email: string;
	password: string;
	name: string;
	avatar: string;
	posts: Schema.Types.ObjectId[];
}

export interface PostInterface extends Document {
	author: Schema.Types.ObjectId;
	title: string;
	text: string;
	date: Date;
}