'use strict';

module.exports.imageFileFilter = function (req, file, callback) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return callback(err, false);
  }
  callback(null, true);
};

module.exports.fileFilter = function (req, file, callback) {
  if (file.mimetype === 'image/png' && file.mimetype === 'image/jpg' && file.mimetype === 'image/jpeg' && file.mimetype === 'image/gif') {
    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return callback(err, false);
  }
  callback(null, true);
};

module.exports.allfiles = function (req, file, callback) {  
  callback(null, true);
};

