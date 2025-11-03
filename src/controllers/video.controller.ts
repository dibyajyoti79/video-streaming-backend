import { Request, Response } from "express";
import { BadRequestError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/api-response";

export const uploadVideoController = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new BadRequestError("Video file is required");
  }

  const videoPath = file.path;

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse("Video uploaded successfully", videoPath));
};
