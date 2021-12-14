import winston, { transports } from 'winston';
const { format } = require('winston');
const { combine, timestamp, printf } = format;

const makeWinston = (appname: string) => {
  const consoleFormatter = printf(({ level, message, logger, timestamp }) => {
    return `${timestamp} [${logger}] [${level}]: ${message}`;
  });

  const defaultOptions = {
    level: 'debug',
    levels: Object.assign({ fatal: 0, warn: 4, trace: 7 }, winston.config.syslog.levels),
    format: combine(timestamp(), consoleFormatter),
    defaultMeta: { service: appname + '_' + (process.env.NODE_ENV || 'development') },
    transports: [new winston.transports.File({ filename: 'logfile.log', level: 'debug' })],
  };

  if (!winston.loggers.has('default')) winston.loggers.add('default', defaultOptions);

  var logger = winston.loggers.get('default');

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        handleExceptions: true,
      })
    );
  }

  logger.child = function () {
    return winston.loggers.get('default');
  };

  return logger;
};

export default makeWinston;
