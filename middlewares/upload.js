import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(HttpError(400, 'File type is not supported'), false);
  }
};

export const upload = multer({
  storage: multer.diskStorage({
    destination: "./temp",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  fileFilter: imageFilter,
});
