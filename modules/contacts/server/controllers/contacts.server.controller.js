'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  Contact = mongoose.model('Contact'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Contact
 */
exports.create = function(req, res) {
  var contact = new Contact(req.body);
  contact.user = req.user;

  contact.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contact);
    }
  });
};

/**
 * Show the current Contact
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var contact = req.contact ? req.contact.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  contact.isCurrentUserOwner = req.user && contact.user && contact.user._id.toString() === req.user._id.toString();

  res.jsonp(contact);
};

/**
 * Update a Contact
 */
exports.update = function(req, res) {
  var contact = req.contact;

  contact = _.extend(contact, req.body);

  contact.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contact);
    }
  });
};

/**
 * Delete an Contact
 */
exports.delete = function(req, res) {
  var contact = req.contact;

  if(contact.photoIdPath != 'modules/users/client/img/profile/default.png') {
    fs.unlink(contact.photoIdPath);
  }

  contact.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contact);
    }
  });
};

/**
 * List of Contacts
 */
exports.list = function(req, res) {
  Contact.find().sort('-created').populate('user', 'displayName').exec(function(err, contacts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contacts);
    }
  });
};

/**
 * Update photoid picture
 */
exports.changeContactPicture = function(req, res) {  
  var existingImageUrl;
  var contact = req.contact;

  // Filtering to upload only images
  var multerConfig = config.uploads.contact.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');

  //My code
  existingImageUrl = contact.photoIdPath;
  if(existingImageUrl && existingImageUrl != 'modules/users/client/img/profile/default.png') {
    fs.unlink(existingImageUrl);
  }
  uploadImage()
    .then(function() {
      var photoIdImageURL = config.uploads.contact.image.dest + req.file.filename;
      var resPath = {
        path: photoIdImageURL
      };
      res.json(resPath);
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
 * Delete photoid picture
 */
exports.deletePhotoIdPicture = function(req, res) {
  var existingImageUrl;

  // Filtering to upload only images

  //My code
  existingImageUrl = req.body.photoIdPath;
  deleteOldImage()
    .then(function() {      
      res.json({
        'status': 'success'
      });
    })
    .catch(function(err) {
      res.status(422).send(err);
    });
  
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
 * Contact middleware
 */
exports.contactByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Contact is invalid'
    });
  }

  Contact.findById(id).populate('user', 'displayName').exec(function (err, contact) {
    if (err) {
      return next(err);
    } else if (!contact) {
      return res.status(404).send({
        message: 'No Contact with that identifier has been found'
      });
    }
    req.contact = contact;
    next();
  });
};
