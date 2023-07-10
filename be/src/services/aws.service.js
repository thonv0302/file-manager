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
  ListObjectsV2Command,
  DeleteObjectsCommand,
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
    const commandPut = new PutObjectCommand(params);

    const urlPut = await getSignedUrl(s3Client, commandPut);
    return {
      uploadURL: urlPut,
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

  deleteFolder = async (location) => {
    let count = 0; // number of files deleted
    async function recursiveDelete(token) {
      // get the files
      const listCommand = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: location,
        ContinuationToken: token,
      });
      let list = await s3.send(listCommand);
      if (list.KeyCount) {
        // if items to delete
        // delete the files
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: list.Contents.map((item) => ({ Key: item.Key })),
            Quiet: false,
          },
        });
        let deleted = await s3.send(deleteCommand);
        count += deleted.Deleted.length;
        // log any errors deleting files
        if (deleted.Errors) {
          deleted.Errors.map((error) =>
            console.log(`${error.Key} could not be deleted - ${error.Code}`)
          );
        }
      }
      // repeat if more files to delete
      if (list.NextContinuationToken) {
        recursiveDelete(list.NextContinuationToken);
      }
      // return total deleted count when finished
      return `${count} files deleted.`;
    }
    // start the recursive function
    return recursiveDelete();
  };
}

module.exports = new AwsService();
