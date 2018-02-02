'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      _id: req.user._id,
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      // username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData,
      userGroup: req.user.userGroup,
    };
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared),
    bodyClass: JSON.stringify(safeUserObject).length > 4 ? 'sidebar-condensed fixed-topbar fixed-sidebar theme-sdtd color-primary' : 'account separate-inputs',
    mainContent: JSON.stringify(safeUserObject).length > 4 ? 'main-content' : '',
    dataPage: JSON.stringify(safeUserObject).length > 4 ? '' : 'login',
    css: JSON.stringify(safeUserObject).length > 4 ? 'md-layout1' : 'layout1',
    sideBar: JSON.stringify(safeUserObject).length > 4 ? 'sidebar' : ''
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
