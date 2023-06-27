const AWS = require('aws-sdk');
const {
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
} = require('../src/configs/aws.config');

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

const URL_EXPIRATION_SECONDS = 300;

const getUploadURL = async function (event) {
  const randomID = parseInt(Math.random() * 10000000);
  const Key = `${randomID}.jpg`;

  // Get signed URL from S3
  const s3Params = {
    Bucket: 'files-manager',
    Key,
    // Expires: URL_EXPIRATION_SECONDS,
    // ContentType: 'image/jpeg',
  };
  const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
  return JSON.stringify({
    uploadURL: uploadURL,
    Key,
  });
};

module.exports = {
  getUploadURL,
};
