import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../models/User";
import config from "config";
import authCheck from "../middleware/auth.middleware";

const token = (id: string): string =>
  jwt.sign({ userId: id }, config.get("jwtSecret"), { expiresIn: "1h" });

const router = Router();

router.post(
  "/signup",
  [
    check("email", "incorrect email").isEmail(),
    check("password", "min password length 6").isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = errors.mapped();
        res.status(400).json({
          message: err?.email?.msg || err?.password?.msg || "invalid data",
        });
        return;
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        res.status(400).json({ message: "user exists" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).json({ token: token(user.id), id: user.id });
    } catch (e) {
      res.status(500).json({ message: "signup error" });
      return;
    }
  }
);

router.post(
  "/signin",
  [
    check("email", "enter correct email").normalizeEmail().isEmail(),
    check("password", "enter pass").exists().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = errors.mapped();
        res.status(400).json({
          message: err?.email?.msg || err?.password?.msg || "invalid data",
        });
        return;
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "user not found" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ message: "password is incorrect" });
        return;
      }

      res.json({
        token: token(user.id),
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      });
    } catch (e) {
      res.status(500).json({ message: "signin error" });
      return;
    }
  }
);

router.get("/checkauth", authCheck, async (req: Request, res: Response) => {
  try {
    const userId = req.body.user.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(400).json({ message: "user not found" });
      return;
    }
    res.json({ id: user.id, name: user.name, avatar: user.avatar });
  } catch (e) {
    res.status(500).json({ message: "checkauth error" });
    return;
  }
});

export default router;
