import { Request, Response, Router } from "express";
import Post from "../models/Post";
import User from "../models/User";
import auth from "../middleware/auth.middleware";

const router = Router();

router.post("/add", auth, async (req: Request, res: Response) => {
  try {
    const { title, text } = req.body;
    const post = new Post({ author: req.body.user.userId, title, text });
    await post.save();
    await Post.findById(post._id).populate("author");
    await User.findByIdAndUpdate(
      req.body.user.userId,
      { $push: { posts: post._id } },
      { new: true }
    )
      .populate("posts")
      .exec();
    res.status(201).json(post);
  } catch (e) {
    res.status(500).json({ message: "publish error" });
    return;
  }
});

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ author: req.body.user.userId });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: "get posts error" });
    return;
  }
});

router.get("/posts", auth, async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ author: req.body.user.userId });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: "get posts error" });
    return;
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: "get post error" });
    return;
  }
});

export default router;
