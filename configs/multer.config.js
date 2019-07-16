const multer = require('multer');

const MulterConfig ={
//Set name for img`s and path for save
    storageConfig : multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/avatars");
        },
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}-${Date.now()}`);
        }
    }),
//Set formats for img`s
    fileFilter : (req, file, cb) => {
        if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
};

module.exports = MulterConfig;