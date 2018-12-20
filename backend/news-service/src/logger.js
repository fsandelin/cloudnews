const { createLogger, format, transports } = require('winston');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = '../logs';

// const filename = path.join(logDir, 'news-service.log');
const filename = './logs/news-service.log';

const logger = createLogger({
  level: env === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({ label: path.basename(module.parent.filename) }),
    format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
  ),
  transports: [
    new transports.File({
      filename,
      format: format.combine(
        format.printf(
          info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
        ),
      ),
    }),
    new transports.Console({
      format: format.combine(
        format.label({ label: path.basename(module.parent.filename) }),
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
        ),
      ),
    }),
  ],
});

module.exports = logger;
