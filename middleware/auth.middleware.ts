import { NextFunction, Request, Response } from "express";
import config from 'config';
import jwt from 'jsonwebtoken';

const authCheck = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<unknown, Record<string, unknown>>> => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: 'no auth' });
		}
		const decoded = jwt.decode(token, config.get('jwtSecret'));
		req.body.user = decoded;
		next();
	} catch (e) {
		res.status(401).json({ message: 'no auth' });
		return;
	}
};

export default authCheck;