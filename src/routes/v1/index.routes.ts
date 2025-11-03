import express from "express";
import pingRouter from "./ping.routes";
import videoRouter from "./video.routes";

const v1Router = express.Router();

v1Router.use("/ping", pingRouter);
v1Router.use("/video", videoRouter);

export default v1Router;
