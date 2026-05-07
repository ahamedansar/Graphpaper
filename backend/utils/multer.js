const multer = require('multer');
const path = require('path');

module.exports = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp') {
            cb(new Error('File type is not supported'), false);
            return;
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
