import { Storage } from '@google-cloud/storage';
import type {
  GetSignedUploadUrlHandler,
  GetSignedUrlHander,
} from '../../types';

let storage: Storage | null = null;

const getStorage = () => {
  if (storage) {
    return storage;
  }

  const projectId = process.env.GCP_PROJECT_ID!;
  if (!projectId) {
    throw new Error('Missing env variable GCP_PROJECT_ID');
  }

  storage = new Storage({ projectId });

  return storage;
};

export const getSignedUploadUrl: GetSignedUploadUrlHandler = async (
  path,
  { bucket }
) => {
  const storage = getStorage();
  try {
    const [url] = await storage
      .bucket(bucket)
      .file(path)
      .getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: 'application/octet-stream',
      });

    return url;
  } catch (e) {
    console.error(e);
    throw new Error('Could not get signed upload url');
  }
};

export const getSignedUrl: GetSignedUrlHander = async (path, { bucket }) => {
  const storage = getStorage();
  try {
    const [url] = await storage
      .bucket(bucket)
      .file(path)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

    return url;
  } catch (e) {
    console.error(e);
    throw new Error('Could not get signed url');
  }
};
