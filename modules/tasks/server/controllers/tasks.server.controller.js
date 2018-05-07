'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  config = require(path.resolve('./config/config')),
  Task = mongoose.model('Task'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  User = mongoose.model('User'),
  fs = require('fs'),
  multer = require('multer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Create a Task
 */
exports.create = function(req, res) {
  async.waterfall([
    function(done) {
      User.find({
        _id: req.body.assignee
      }, function(err, assignee) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          done(err, assignee[0]);
        }
      });
    },
    function(assignee, done) {
      var task = new Task(req.body);
      task.user = req.user;

      task.save(function(err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          done(err, task, assignee);
        }
      });
    },
    function(task, assignee, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      var imageUrl = task.createdProfileImage.replace('./', '/');
      res.render(path.resolve('modules/tasks/server/templates/task-create-email'), {
        createdBy: task.createdBy,
        assignee: assignee.displayName,
        taskId: task.taskID,
        taskTitle: task.title,
        createdImgUrl: imageUrl,
        appName: config.app.title,
        url: baseUrl + '/authentication/signin'
      }, function(err, emailHTML) {
        done(err, emailHTML, task, assignee, req);
      });
    },

    // If valid email, send reset email using service
    function(emailHTML, task, assignee, req, done) {
      var createdName = req.user.displayName;
      var fromCreated = "";
      if (createdName != undefined) {
        fromCreated = config.mailer.from.replace("Hydro-Admin", createdName);
      }
      var mailOptions = {
        to: assignee.email,
        from: fromCreated,
        subject: '[Hydro] (HYD-'+task.taskID+') ' + task.title,
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log(err);
        if (!err) {
          res.jsonp(task);
        } else {
          console.log(err);
          return res.status(302).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
  }); 
};

/**
 * Show the current Task
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var task = req.task ? req.task.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  task.isCurrentUserOwner = req.user && task.user && task.user._id.toString() === req.user._id.toString();

  res.jsonp(task);
};

/**
 * Update a Task
 */
exports.update = function(req, res) {
  async.waterfall([
    function(done) {
      User.find({
        _id: req.body.assignee
      }, function(err, assignee) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          done(err, assignee[0]);
        }
      });
    },
    
    function(assignee, done) {
      var task = req.task;
      task = _.extend(task, req.body);
      if(task.deletedAttachement) {
        fs.unlink(task.deletedAttachement.fileURL);
      };
      task.save(function(err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          done(err, task, assignee);
        }
      });
    },
    function(task, assignee, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      var imageUrl = task.createdProfileImage.replace('./', '/');
      res.render(path.resolve('modules/tasks/server/templates/task-create-email'), {
        createdBy: task.createdBy,
        assignee: assignee.displayName,
        taskId: task.taskID,
        taskTitle: task.title,
        createdImgUrl: imageUrl,
        appName: config.app.title,
        projectCode: task.projectCode,
        taskCode: task.taskCode,
        status: _.startCase(task.status),
        hasCommets: task.hasCommets,
        hasStatus: task.hasStatus,
        hasAssignee: task.hasAssignee,
        comments: task.latestComment,
        url: baseUrl + '/authentication/signin'
      }, function(err, emailHTML) {
        done(err, emailHTML, task, assignee, req);
      });
    },

    // If valid email, send reset email using service
    function(emailHTML, task, assignee, req, done) {
      var createdName = req.user.displayName;
      var fromCreated = "";
      if (createdName != undefined) {
        fromCreated = config.mailer.from.replace("Hydro-Admin", createdName);
      }
      var mailOptions = {
        to: assignee.email,
        from: fromCreated,
        subject: '['+task.projectCode+'] ('+task.taskCode+') ' + task.title,
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log(err);
        if (!err) {
          res.jsonp(task);
        } else {
          console.log(err);
          return res.status(302).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
  }); 
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
  var task = req.task;

  task.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(task);
    }
  });
};

/**
 * List of Tasks
 */
exports.list = function(req, res) {
  Task.find().sort('-created').populate('user', 'displayName').exec(function(err, tasks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tasks);
    }
  });
};

/**
 * List of Tasks by Assignee
 */
exports.getTasksByAssignee = function(req, res) {  
  Task.find({
      assignee: req.user._id
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

exports.uploadFiles = function(req, res) {  
  var existingImageUrl;
  var task = req.task;
  task = _.extend(task, req.body);
  

  // Filtering to upload only images
  var multerConfig = config.uploads.task.file;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).fileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');
  
  uploadImage()
    .then(function() {
      var photoIdImageURL = config.uploads.task.file.dest + req.file.filename;     
      
      task.fileURL =  photoIdImageURL;
      task.filename =  req.file.originalname;

      task.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var taskJSON = {
            fileURL: photoIdImageURL,
            filename: req.file.originalname
          }
          res.jsonp(taskJSON);
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
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Task is invalid'
    });
  }

  Task.findById(id).populate('user', 'displayName').exec(function (err, task) {
    if (err) {
      return next(err);
    } else if (!task) {
      return res.status(404).send({
        message: 'No Task with that identifier has been found'
      });
    }
    req.task = task;
    next();
  });
};
