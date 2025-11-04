import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import logger from "../config/logger.config";

interface Resolution {
  width: number;
  height: number;
  bitrate: number;
}
const resolutions: Resolution[] = [
  { width: 1920, height: 1080, bitrate: 5000000 }, // 1080p (around 5 Mbps typical)
  { width: 1280, height: 720, bitrate: 2500000 }, // 720p (around 2.5 Mbps)
  { width: 854, height: 480, bitrate: 1000000 }, // 480p (around 1 Mbps)
  { width: 640, height: 360, bitrate: 750000 }, // 360p (around 0.75 Mbps)
  { width: 426, height: 240, bitrate: 400000 }, // 240p (around 0.4 Mbps)
  { width: 256, height: 144, bitrate: 150000 }, // 144p (around 0.15 Mbps)
];

export const processVideoForHLS = (
  inputPath: string,
  outputPath: string,
  callback: (error: Error | null, masterPlaylist?: string) => void
) => {
  logger.info("Creating output directory");
  fs.mkdirSync(outputPath, { recursive: true });

  const masterPlaylist = `${outputPath}/master.m3u8`;
  const masterContent: string[] = [];
  let countProcessing = 0;

  resolutions.forEach((resolution) => {
    logger.info(`Processing ${resolution.height}p`);
    const variantOutput = `${outputPath}/${resolution.height}p`;
    const variantPlaylist = `${variantOutput}/playlist.m3u8`;
    fs.mkdirSync(variantOutput, { recursive: true });
    ffmpeg(inputPath)
      .outputOption([
        `-vf scale=w=${resolution.width}:h=${resolution.height}`,
        `-b:v ${resolution.bitrate}k`,
        `-codec:v libx264`,
        `-codec:a aac`,
        `-hls_time 10`,
        `-hls_playlist_type vod`,
        `-hls_segment_filename ${variantOutput}/segment%03d.ts`,
      ])
      .output(variantPlaylist)
      .on("end", () => {
        masterContent.push(
          `#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bitrate},RESOLUTION=${resolution.width}x${resolution.height}\n${resolution.height}p/playlist.m3u8`
        );
        countProcessing++;
        if (countProcessing === resolutions.length) {
          fs.writeFileSync(
            masterPlaylist,
            `#EXTM3U\n${masterContent.join("\n")}`
          );
          callback(null, masterPlaylist);
        }
      })
      .on("error", (err) => {
        logger.error("Error processing video:", err);
        callback(err);
      })
      .run();
  });
};
