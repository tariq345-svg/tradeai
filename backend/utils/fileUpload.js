const path = require('path');
const multer = require('multer');
const ErrorResponse = require('./errorResponse');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.env.FILE_UPLOAD_PATH || './uploads/');
  },
  filename: function(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Error: Images only! (jpeg, jpg, png, gif)', 400));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_UPLOAD * 1024 * 1024 // 10MB default
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('file');

// Middleware for handling file uploads
const uploadFile = (req, res, next) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return next(new ErrorResponse(`File upload error: ${err.message}`, 400));
    } else if (err) {
      // An unknown error occurred when uploading
      return next(new ErrorResponse(err.message, 400));
    }
    
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // File uploaded successfully
    req.file.path = req.file.path.replace(/\\/g, '/'); // Convert Windows path to Unix-style
    next();
  });
};

module.exports = uploadFile;
