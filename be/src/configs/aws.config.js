'use strict';

module.exports = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-southeast-1',
  bucket: 'direct-upload-files',
  signatureVersion: 'v4',
};
