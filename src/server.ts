import express from "express";
import { serverConfig } from "./config";
import v1Router from "./routes/v1/index.routes";
import { appErrorHandler } from "./middlewares/error.middleware";
import logger from "./config/logger.config";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors());
app.use(attachCorrelationIdMiddleware);
app.use("/api/v1", v1Router);

app.use("/output", express.static(path.join(__dirname, "../output")));

app.use(appErrorHandler);

app.listen(serverConfig.PORT, () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
});
