import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/User';
import config from 'config';
const router = Router();

router.post(
	'/signup',
	[
		check('email', 'incorrect email').isEmail(),
		check('password', 'min password length 6').isLength({ min: 6 })
	],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'invalid data'
				});
			}
			const { email, password } = req.body;
			const candidate = await User.findOne({ email });
			if (candidate) {
				res.status(400).json({ message: 'user exists' });
			}
			const hashedPassword = await bcrypt.hash(password, 12);

			const user = new User({ email, password: hashedPassword });
			await user.save();

			res.status(201).json({ message: 'user created' });


		} catch (e) {
			res.status(500).json({ message: 'signup error' });
		}
	});

router.post(
	'/signin',
	[
		check('email', 'enter correct email').normalizeEmail().isEmail(),
		check('password', 'enter pass').exists()
	],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'invalid data'
				});
			}
			const { email, password } = req.body;

			const user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ message: 'user not found' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: 'password is incorrect' });
			}

			const token = jwt.sign(
				{ userId: user.id },
				config.get('jwtSecret'),
				{expiresIn: '1h'}
			);

			res.json({token, userId: user.id});

		} catch (e) {
			res.status(500).json({ message: 'signup error' });
		}
	});

export default router;