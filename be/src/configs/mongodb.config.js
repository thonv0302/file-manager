'use strict';

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3066,
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'ImageManager',
  },
};

const config = {
  dev,
};

const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
