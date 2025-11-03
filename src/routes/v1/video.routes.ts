import { Router } from "express";
import { uploadVideoController } from "../../controllers/video.controller";
import upload from "../../middlewares/multer.middleware";

const videoRouter = Router();

videoRouter.post("/upload", upload.single("video"), uploadVideoController);

export default videoRouter;
