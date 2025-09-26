const multer = require('multer');
const path = require('path');

const createStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/uploads/${folder}`);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + path.extname(file.originalname);
      cb(null, uniqueName);
    }
  });
};

const partnerUpload = multer({ storage: createStorage('partners') });
const positionUpload = multer({ storage: createStorage('positions') });
const postUpload = multer({ storage: createStorage('posts') });

module.exports = {
  partnerUpload,
  positionUpload,
  postUpload,
};