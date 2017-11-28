const multer = require("multer");

const myUploader =
  multer({           // add "public/uploads" to ".gitignore"
      dest: __dirname + '/../public/uploads/'
  });

module.exports = myUploader;
