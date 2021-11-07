import { NextFunction, Request, Response } from "express";
import multer from "multer";
import fs from "fs";

const avatarUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.method === "OPTIONS") {
    return next();
  }
  const { user } = req.body;
  const { userId } = user;
  const path = `uploads/avatar/${userId}/`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const uniqName = `${file.originalname}_${Date.now()}.webp`;
      cb(null, uniqName);
    },
  });

  const upload = multer({ storage: storage });
  const middleware = upload.single("avatar");
  return middleware(req, res, () => {
    try {
      req.body.user = user;
      next();
    } catch (e) {
      next(e);
      return;
    }
  });
};

export default avatarUpload;
