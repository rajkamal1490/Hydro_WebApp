'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  Nitprocess = mongoose.model('Nitprocess'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Nitprocess
 */
exports.create = function(req, res) {
  var nitprocess = new Nitprocess(req.body);
  nitprocess.user = req.user;

  nitprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(nitprocess);
    }
  });
};

/**
 * Show the current Nitprocess
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var nitprocess = req.nitprocess ? req.nitprocess.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  nitprocess.isCurrentUserOwner = req.user && nitprocess.user && nitprocess.user._id.toString() === req.user._id.toString();

  res.jsonp(nitprocess);
};

/**
 * Update a Nitprocess
 */
exports.update = function(req, res) {
  var nitprocess = req.nitprocess;

  nitprocess = _.extend(nitprocess, req.body);

  nitprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(nitprocess);
    }
  });
};

/**
 * Delete an Nitprocess
 */
exports.delete = function(req, res) {
  var nitprocess = req.nitprocess;

  nitprocess.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(nitprocess);
    }
  });
};

/**
 * List of Nitprocesses
 */
exports.list = function(req, res) {
  Nitprocess.find().sort('-created').populate('user', 'displayName').exec(function(err, nitprocesses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(nitprocesses);
    }
  });
};

exports.uploadFiles = function(req, res) {
  var existingImageUrl;
  var nitprocess = req.nitprocess;
  nitprocess = _.extend(nitprocess, req.body);


  // Filtering to upload only images
  var multerConfig = config.uploads.nitProcess.file;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).fileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');
  uploadImage()
    .then(function() {
      var photoIdImageURL = config.uploads.nitProcess.file.dest + req.file.filename;
      if (nitprocess.fileURL != undefined && photoIdImageURL != nitprocess.fileURL) {
        fs.unlink(nitprocess.fileURL);
      }

      nitprocess.fileURL =  photoIdImageURL;
      nitprocess.filename =  req.file.originalname;

      nitprocess.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(nitprocess);
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
 * Nitprocess middleware
 */
exports.nitprocessByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Nitprocess is invalid'
    });
  }

  Nitprocess.findById(id).populate('user', 'displayName').exec(function (err, nitprocess) {
    if (err) {
      return next(err);
    } else if (!nitprocess) {
      return res.status(404).send({
        message: 'No Nitprocess with that identifier has been found'
      });
    }
    req.nitprocess = nitprocess;
    next();
  });
};

/**
 * awaitingForNitApproval
 */

exports.awaitingForNitApproval = function(req, res) {
  Nitprocess.find({
    $and: [{
      hasApproved: 0
    }]
  }, function(err, entries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entries);
    }
  });
};

