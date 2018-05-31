'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  FileManager = mongoose.model('FileManager'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a File manager
 */
exports.create = function(req, res) {
  var fileManager = new FileManager(req.body);
  fileManager.user = req.user;

  fileManager.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fileManager);
    }
  });
};

/**
 * Show the current File manager
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var fileManager = req.fileManager ? req.fileManager.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  fileManager.isCurrentUserOwner = req.user && fileManager.user && fileManager.user._id.toString() === req.user._id.toString();

  res.jsonp(fileManager);
};

/**
 * Update a File manager
 */
exports.update = function(req, res) {
  var fileManager = req.fileManager;

  fileManager = _.extend(fileManager, req.body);

  fileManager.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fileManager);
    }
  });
};

/**
 * Delete an File manager
 */
exports.delete = function(req, res) {
  var fileManager = req.fileManager;

  if(fileManager.fileURL)
    fs.unlink(fileManager.fileURL);

  fileManager.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fileManager);
    }
  });
};

/**
 * List of File managers
 */
exports.list = function(req, res) {
  FileManager.find().sort('-created').populate('user', 'displayName').exec(function(err, fileManagers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fileManagers);
    }
  });
};

exports.uploadFiles = function(req, res) {
  var existingImageUrl;
  var fileManager = req.fileManager;
  fileManager = _.extend(fileManager, req.body);


  // Filtering to upload only images
  var multerConfig = config.uploads.fileManager.file;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).fileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');

  uploadImage()
    .then(function() {
      var photoIdImageURL = config.uploads.fileManager.file.dest + req.file.filename;

      fileManager.fileURL =  photoIdImageURL;
      fileManager.filename =  req.file.originalname;

      fileManager.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(fileManager);
        }
      });
    })
    .catch(function(err) {
      res.status(422).send(err);
    });

  function uploadImage() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage() {
    return new Promise(function(resolve, reject) {
      fs.unlink(existingImageUrl, function(unlinkError) {
        if (unlinkError) {
          console.log(unlinkError);
          reject({
            message: 'Error occurred while deleting old profile picture'
          });
        } else {
          resolve();
        }
      });
    });
  }

};

/**
 * File manager middleware
 */
exports.fileManagerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'File manager is invalid'
    });
  }

  FileManager.findById(id).populate('user', 'displayName').exec(function (err, fileManager) {
    if (err) {
      return next(err);
    } else if (!fileManager) {
      return res.status(404).send({
        message: 'No File manager with that identifier has been found'
      });
    }
    req.fileManager = fileManager;
    next();
  });
};
