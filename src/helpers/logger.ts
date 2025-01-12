import { LogLevel } from "../types/utils";

export const logMessage = (
  logLevel: LogLevel = LogLevel.Debug,
  message: any,
  addedInfo: string = ""
) => {
  switch (logLevel) {
    case LogLevel.Debug:
      console.debug(`${logLevel} ${addedInfo} --> ${message}`);
      break;
    case LogLevel.Info:
      console.info(`${logLevel} ${addedInfo} --> ${message}`);
      break;
    case LogLevel.Error:
      console.error(`${logLevel} ${addedInfo} --> ${message}`);
      break;
    case LogLevel.Warning:
      console.warn(`${logLevel} ${addedInfo} --> ${message}`);
      break;
  }
};
