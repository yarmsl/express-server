import { Schema, model } from "mongoose";
import { PostInterface } from "../types/types";

const postSchema = new Schema<PostInterface>({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: new Date() },
});

export default model("Post", postSchema);
