import { Request, Response, Router } from "express";
import authCheck from "../middleware/auth.middleware";
import avatarUpload from "../middleware/avatar.middleware";
import User from "../models/User";

const router = Router();

router.post(
  "/",
  authCheck,
  avatarUpload,
  async (req: Request, res: Response) => {
    const avatar = req.file != null ? req.file.path : "";
    const name = req.body.name;
    const { userId } = req.body.user;
    console.log(userId)
    try {
      if (name) {
        await User.findOneAndUpdate(
          { _id: userId },
          { avatar: avatar, name: name }
        );
      } else {
        await User.findOneAndUpdate({ _id: userId }, { avatar: avatar });
      }
      res.status(200).json({ avatar: avatar, name: name });
    } catch (e) {
      res.status(500).json({ message: "upload file or set name error" });
      return;
    }
  }
);

router.put("/", authCheck, async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const { userId } = req.body.user;
    await User.findOneAndUpdate({ _id: userId }, { name: name });
    res.status(200).json({ name: name });
  } catch (e) {
    res.status(500).json({ message: "set name error" });
    return;
  }
});

export default router;
