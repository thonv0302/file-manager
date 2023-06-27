'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Block';
const COLLECTION_NAME = 'blocks';

// Declare the Schema of the Mongo model
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isFolder: {
      type: Boolean,
      required: true,
      default: false,
    },
    fileType: {
      type: String,
      required: true,
      default: 'folder',
    },
    size: {
      type: Number,
      default: 0,
    },
    fileUrl: {
      type: String,
      required: true,
      default:
        'https://direct-upload-files.s3.ap-southeast-1.amazonaws.com/icons8-folder-480.png',
    },
    parentFolder: {
      type: Schema.Types.Mixed,
      ref: 'Block',
      default: '',
    },
    ancestorFolders: [
      {
        ancestorId: {
          type: Schema.Types.ObjectId,
          ref: 'Block',
        },
        ancestorName: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, userSchema);
