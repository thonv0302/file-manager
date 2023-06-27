// const crypto = require('crypto');
// const { NotFoundError, BadRequestError } = require('../core/error.response');

const {
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
  signatureVersion,
} = require('../configs/aws.config');

const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  signatureVersion,
});

class AwsService {
  getUrl = async ({ key }) => {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    // const commandPut = new PutObjectCommand(params);
    // const commandGet = new GetObjectCommand(params);

    // const [urlPut, urlGet] = await Promise.all([
    //   getSignedUrl(s3Client, commandPut),
    //   getSignedUrl(s3Client, commandGet),
    // ]);
    const commandPut = new PutObjectCommand(params);

    const urlPut = await getSignedUrl(s3Client, commandPut);
    return {
      uploadURL: urlPut,
      // getURL: urlGet,
    };
  };

  getUploadUrls = async ({ keys }) => {
    const commandPuts = [];
    keys.forEach((key) => {
      commandPuts.push(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
    });

    const urlPuts = await Promise.all(
      commandPuts.map((commandPut) => getSignedUrl(s3Client, commandPut))
    );

    return {
      urlPuts,
    };
  };
}

module.exports = new AwsService();
