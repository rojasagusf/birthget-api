import {createLogger, transports, format, Logger} from 'winston';
let logger: Logger;

const myFormat = format.printf(({level, message, timestamp}) => {
  let toLog = message;
  if (message && message.constructor === Object) {
    toLog = JSON.stringify(message, null, 4);
  }
  return `${timestamp} ${level}: ${toLog}`;
});

if (process.env.NODE_ENV === 'production') {
  logger = createLogger({
    transports: [
      new transports.Console({
        level:            'info',
        handleExceptions: true,
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.timestamp(),
          myFormat
        )
      })
    ],
    exitOnError: true
  });
} else {
  logger = createLogger({
    transports: [
      new (transports.Console)({
        level:     'debug',
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.timestamp(),
          myFormat
        )
      })
    ]
  });
}

export default logger;
