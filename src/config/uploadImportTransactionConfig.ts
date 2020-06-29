import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const folderTemp = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: folderTemp,
  storage: multer.diskStorage({
    destination: folderTemp,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(15).toString('hex');
      const fileName = `${fileHash}-${file.fieldname}`;

      return callback(null, fileName);
    },
  }),
};
