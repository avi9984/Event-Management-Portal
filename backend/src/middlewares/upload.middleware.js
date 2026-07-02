import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "src/uploads";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {
        const unique = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}${path.extname(file.originalname)}`;

        cb(null, unique);
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
        return cb(new Error("Only image files are allowed."));
    }

    cb(null, true);
};

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});