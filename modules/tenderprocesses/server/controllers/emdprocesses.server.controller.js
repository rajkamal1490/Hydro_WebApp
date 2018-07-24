'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  Emdprocess = mongoose.model('Emdprocess'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Emdprocess
 */
exports.create = function(req, res) {
  var emdprocess = new Emdprocess(req.body);
  emdprocess.user = req.user;

  emdprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emdprocess);
    }
  });
};

/**
 * Show the current Emdprocess
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var emdprocess = req.emdprocess ? req.emdprocess.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  emdprocess.isCurrentUserOwner = req.user && emdprocess.user && emdprocess.user._id.toString() === req.user._id.toString();

  res.jsonp(emdprocess);
};

/**
 * Update a Emdprocess
 */
exports.update = function(req, res) {
  var emdprocess = req.emdprocess;

  emdprocess = _.extend(emdprocess, req.body);

  emdprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emdprocess);
    }
  });
};

/**
 * Delete an Emdprocess
 */
exports.delete = function(req, res) {
  var emdprocess = req.emdprocess;

  emdprocess.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emdprocess);
    }
  });
};

/**
 * List of Emdprocesses
 */
exports.list = function(req, res) {
  Emdprocess.find().sort('-created').populate('user', 'displayName').exec(function(err, emdprocesses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emdprocesses);
    }
  });
};

exports.uploadFiles = function(req, res) {
  var existingImageUrl;
  var emdprocess = req.emdprocess;
  emdprocess = _.extend(emdprocess, req.body);


  // Filtering to upload only images
  var multerConfig = config.uploads.emdProcess.file;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).fileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');
  uploadImage()
    .then(function() {
      var photoIdImageURL = config.uploads.emdProcess.file.dest + req.file.filename;
      if (emdprocess.fileURL != undefined && photoIdImageURL != emdprocess.fileURL) {
        fs.unlink(emdprocess.fileURL);
      }

      emdprocess.fileURL =  photoIdImageURL;
      emdprocess.filename =  req.file.originalname;

      emdprocess.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(emdprocess);
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
 * Emdprocess middleware
 */
exports.emdprocessByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Emdprocess is invalid'
    });
  }

  Emdprocess.findById(id).populate('user', 'displayName').exec(function (err, emdprocess) {
    if (err) {
      return next(err);
    } else if (!emdprocess) {
      return res.status(404).send({
        message: 'No Emdprocess with that identifier has been found'
      });
    }
    req.emdprocess = emdprocess;
    next();
  });
};


/**
 * awaitingForNitApproval
 */

exports.awaitingForEmdApproval = function(req, res) {
  Emdprocess.find({
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