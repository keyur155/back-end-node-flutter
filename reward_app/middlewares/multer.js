const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Memory storage for web uploads
const memoryStorage = multer.memoryStorage();

// Disk storage for mobile uploads
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Conditional storage based on request type
const upload = (req, res, next) => {
    // Check if the request is from the web (you can use a custom header or any other logic)
    const isWebUpload = req.headers['x-upload-type'] === 'web'; // Example header check

    const multerUpload = multer({
        storage: isWebUpload ? memoryStorage : diskStorage
    }).single('image');

    multerUpload(req, res, next);
};

module.exports = upload;

// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const storage = multer.diskStorage({

//     destination: function (req, file, cb) {
//         const uploadPath = path.join(__dirname, '../uploads');
    
//     // Check if the directory exists, if not, create it
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     cb(null, uploadPath);
//       },
//     filename :function(req,file,cb){
//         cb(null ,file.originalname)
//     }


// });
// const upload =multer({storage :storage});
// module.exports = upload;