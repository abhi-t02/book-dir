import path from "path";

import winston from "winston";
import morgan from "morgan";

const logPath = path.join(__dirname, "../../logs/app.log");
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: "http",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    json()
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({
    //   filename: logPath,
    // }),
  ],
});

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

export default morganMiddleware;
