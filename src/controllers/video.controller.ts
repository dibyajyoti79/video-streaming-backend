import { Request, Response } from "express";
import { BadRequestError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/api-response";
import { processVideoForHLS } from "../services/video.service";
import fs from "fs";
import logger from "../config/logger.config";

export const uploadVideoController = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new BadRequestError("Video file is required");
  }

  logger.info("Video file uploaded received");

  const videoPath = file.path;
  const outputPath = `output/${Date.now()}`;
  logger.info("Processing video for HLS");
  processVideoForHLS(videoPath, outputPath, (err, masterPlaylist) => {
    if (err) {
      throw new BadRequestError("Error processing video", err);
    }
    logger.info("Video processed successfully");
    logger.info("Deleting video file");
    fs.unlink(videoPath, (err) => {
      if (err) {
        logger.error("Error deleting video:", err);
        return;
      }
      logger.info("Video deleted successfully");
    });
    const videoUrl = `${process.env.APP_URL}/${outputPath}/master.m3u8`;
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Video Uploaded Successfully", videoUrl));
  });
};
