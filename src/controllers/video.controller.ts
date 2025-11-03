import { Request, Response } from "express";
import { BadRequestError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/api-response";
import { processVideoForHLS } from "../services/video.service";
import fs from "fs";

export const uploadVideoController = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new BadRequestError("Video file is required");
  }

  const videoPath = file.path;
  const outputPath = `output/${Date.now()}`;
  processVideoForHLS(videoPath, outputPath, (err, masterPlaylist) => {
    if (err) {
      throw new BadRequestError("Error processing video", err);
    }
    fs.unlink(videoPath, (err) => {
      if (err) {
        console.error("Error deleting video:", err);
        return;
      }
      console.log("Video deleted successfully");
    });
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Video processed successfully", masterPlaylist));
  });
};
