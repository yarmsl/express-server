import {Document} from 'mongoose';

export interface UserInterface extends Document {
	email: string;
	password: string;
	name: string;
	avatar: string;
	posts?: PostInterface[];
}

export interface PostInterface extends Document {
	author: string;
	title: string;
	text: string;
	date: Date;
}