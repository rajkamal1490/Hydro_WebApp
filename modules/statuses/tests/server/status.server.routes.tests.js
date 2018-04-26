'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Status = mongoose.model('Status'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  status;

/**
 * Status routes tests
 */
describe('Status CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Status
    user.save(function () {
      status = {
        name: 'Status name'
      };

      done();
    });
  });

  it('should be able to save a Status if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Status
        agent.post('/api/statuses')
          .send(status)
          .expect(200)
          .end(function (statusSaveErr, statusSaveRes) {
            // Handle Status save error
            if (statusSaveErr) {
              return done(statusSaveErr);
            }

            // Get a list of Statuses
            agent.get('/api/statuses')
              .end(function (statusesGetErr, statusesGetRes) {
                // Handle Statuses save error
                if (statusesGetErr) {
                  return done(statusesGetErr);
                }

                // Get Statuses list
                var statuses = statusesGetRes.body;

                // Set assertions
                (statuses[0].user._id).should.equal(userId);
                (statuses[0].name).should.match('Status name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Status if not logged in', function (done) {
    agent.post('/api/statuses')
      .send(status)
      .expect(403)
      .end(function (statusSaveErr, statusSaveRes) {
        // Call the assertion callback
        done(statusSaveErr);
      });
  });

  it('should not be able to save an Status if no name is provided', function (done) {
    // Invalidate name field
    status.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Status
        agent.post('/api/statuses')
          .send(status)
          .expect(400)
          .end(function (statusSaveErr, statusSaveRes) {
            // Set message assertion
            (statusSaveRes.body.message).should.match('Please fill Status name');

            // Handle Status save error
            done(statusSaveErr);
          });
      });
  });

  it('should be able to update an Status if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Status
        agent.post('/api/statuses')
          .send(status)
          .expect(200)
          .end(function (statusSaveErr, statusSaveRes) {
            // Handle Status save error
            if (statusSaveErr) {
              return done(statusSaveErr);
            }

            // Update Status name
            status.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Status
            agent.put('/api/statuses/' + statusSaveRes.body._id)
              .send(status)
              .expect(200)
              .end(function (statusUpdateErr, statusUpdateRes) {
                // Handle Status update error
                if (statusUpdateErr) {
                  return done(statusUpdateErr);
                }

                // Set assertions
                (statusUpdateRes.body._id).should.equal(statusSaveRes.body._id);
                (statusUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Statuses if not signed in', function (done) {
    // Create new Status model instance
    var statusObj = new Status(status);

    // Save the status
    statusObj.save(function () {
      // Request Statuses
      request(app).get('/api/statuses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Status if not signed in', function (done) {
    // Create new Status model instance
    var statusObj = new Status(status);

    // Save the Status
    statusObj.save(function () {
      request(app).get('/api/statuses/' + statusObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', status.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Status with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/statuses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Status is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Status which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Status
    request(app).get('/api/statuses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Status with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Status if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Status
        agent.post('/api/statuses')
          .send(status)
          .expect(200)
          .end(function (statusSaveErr, statusSaveRes) {
            // Handle Status save error
            if (statusSaveErr) {
              return done(statusSaveErr);
            }

            // Delete an existing Status
            agent.delete('/api/statuses/' + statusSaveRes.body._id)
              .send(status)
              .expect(200)
              .end(function (statusDeleteErr, statusDeleteRes) {
                // Handle status error error
                if (statusDeleteErr) {
                  return done(statusDeleteErr);
                }

                // Set assertions
                (statusDeleteRes.body._id).should.equal(statusSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Status if not signed in', function (done) {
    // Set Status user
    status.user = user;

    // Create new Status model instance
    var statusObj = new Status(status);

    // Save the Status
    statusObj.save(function () {
      // Try deleting Status
      request(app).delete('/api/statuses/' + statusObj._id)
        .expect(403)
        .end(function (statusDeleteErr, statusDeleteRes) {
          // Set message assertion
          (statusDeleteRes.body.message).should.match('User is not authorized');

          // Handle Status error error
          done(statusDeleteErr);
        });

    });
  });

  it('should be able to get a single Status that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Status
          agent.post('/api/statuses')
            .send(status)
            .expect(200)
            .end(function (statusSaveErr, statusSaveRes) {
              // Handle Status save error
              if (statusSaveErr) {
                return done(statusSaveErr);
              }

              // Set assertions on new Status
              (statusSaveRes.body.name).should.equal(status.name);
              should.exist(statusSaveRes.body.user);
              should.equal(statusSaveRes.body.user._id, orphanId);

              // force the Status to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Status
                    agent.get('/api/statuses/' + statusSaveRes.body._id)
                      .expect(200)
                      .end(function (statusInfoErr, statusInfoRes) {
                        // Handle Status error
                        if (statusInfoErr) {
                          return done(statusInfoErr);
                        }

                        // Set assertions
                        (statusInfoRes.body._id).should.equal(statusSaveRes.body._id);
                        (statusInfoRes.body.name).should.equal(status.name);
                        should.equal(statusInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Status.remove().exec(done);
    });
  });
});
