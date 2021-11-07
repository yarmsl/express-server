import express from "express";
import config from "config";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import postsRoutes from "./routes/posts.routes";
import userRoutes from "./routes/user.routes";
import cors from "cors";

const corsOptions = {
  origin: [
    config.get<string>("frontUriDev"),
    config.get<string>("frontUriIp"),
    config.get<string>("frontUriProd"),
    config.get<string>("frontUriProdSSL"),
  ],
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/post", postsRoutes);
app.use("/api/user", userRoutes);

const PORT = config.get("port") || 5000;

const start = async () => {
  try {
    await mongoose.connect(config.get("mongoUri"), {});
  } catch (e) {
    console.warn("Server error ", e);
    process.exit(1);
  }
};
start();

app.listen(PORT, () => console.log(`Server up port ${PORT}`));

console.log("app express");
