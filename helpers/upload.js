import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tmpPath = path.join(__dirname, "..", "tmp");

const multerConfig = multer.diskStorage({
  destination: tmpPath,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: multerConfig,
});
