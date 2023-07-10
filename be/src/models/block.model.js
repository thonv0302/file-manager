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
      default: '',
    },
    parentFolder: {
      type: Schema.Types.Mixed,
      ref: 'Block',
      default: '',
    },
    ancestorFolders: [
      {
        type: Schema.Types.Mixed,
        ref: 'Block',
        default: '',
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, userSchema);
