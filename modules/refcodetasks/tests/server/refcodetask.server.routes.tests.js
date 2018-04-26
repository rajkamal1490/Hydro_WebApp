'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Refcodetask = mongoose.model('Refcodetask'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  refcodetask;

/**
 * Refcodetask routes tests
 */
describe('Refcodetask CRUD tests', function () {

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

    // Save a user to the test db and create new Refcodetask
    user.save(function () {
      refcodetask = {
        name: 'Refcodetask name'
      };

      done();
    });
  });

  it('should be able to save a Refcodetask if logged in', function (done) {
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

        // Save a new Refcodetask
        agent.post('/api/refcodetasks')
          .send(refcodetask)
          .expect(200)
          .end(function (refcodetaskSaveErr, refcodetaskSaveRes) {
            // Handle Refcodetask save error
            if (refcodetaskSaveErr) {
              return done(refcodetaskSaveErr);
            }

            // Get a list of Refcodetasks
            agent.get('/api/refcodetasks')
              .end(function (refcodetasksGetErr, refcodetasksGetRes) {
                // Handle Refcodetasks save error
                if (refcodetasksGetErr) {
                  return done(refcodetasksGetErr);
                }

                // Get Refcodetasks list
                var refcodetasks = refcodetasksGetRes.body;

                // Set assertions
                (refcodetasks[0].user._id).should.equal(userId);
                (refcodetasks[0].name).should.match('Refcodetask name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Refcodetask if not logged in', function (done) {
    agent.post('/api/refcodetasks')
      .send(refcodetask)
      .expect(403)
      .end(function (refcodetaskSaveErr, refcodetaskSaveRes) {
        // Call the assertion callback
        done(refcodetaskSaveErr);
      });
  });

  it('should not be able to save an Refcodetask if no name is provided', function (done) {
    // Invalidate name field
    refcodetask.name = '';

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

        // Save a new Refcodetask
        agent.post('/api/refcodetasks')
          .send(refcodetask)
          .expect(400)
          .end(function (refcodetaskSaveErr, refcodetaskSaveRes) {
            // Set message assertion
            (refcodetaskSaveRes.body.message).should.match('Please fill Refcodetask name');

            // Handle Refcodetask save error
            done(refcodetaskSaveErr);
          });
      });
  });

  it('should be able to update an Refcodetask if signed in', function (done) {
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

        // Save a new Refcodetask
        agent.post('/api/refcodetasks')
          .send(refcodetask)
          .expect(200)
          .end(function (refcodetaskSaveErr, refcodetaskSaveRes) {
            // Handle Refcodetask save error
            if (refcodetaskSaveErr) {
              return done(refcodetaskSaveErr);
            }

            // Update Refcodetask name
            refcodetask.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Refcodetask
            agent.put('/api/refcodetasks/' + refcodetaskSaveRes.body._id)
              .send(refcodetask)
              .expect(200)
              .end(function (refcodetaskUpdateErr, refcodetaskUpdateRes) {
                // Handle Refcodetask update error
                if (refcodetaskUpdateErr) {
                  return done(refcodetaskUpdateErr);
                }

                // Set assertions
                (refcodetaskUpdateRes.body._id).should.equal(refcodetaskSaveRes.body._id);
                (refcodetaskUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Refcodetasks if not signed in', function (done) {
    // Create new Refcodetask model instance
    var refcodetaskObj = new Refcodetask(refcodetask);

    // Save the refcodetask
    refcodetaskObj.save(function () {
      // Request Refcodetasks
      request(app).get('/api/refcodetasks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Refcodetask if not signed in', function (done) {
    // Create new Refcodetask model instance
    var refcodetaskObj = new Refcodetask(refcodetask);

    // Save the Refcodetask
    refcodetaskObj.save(function () {
      request(app).get('/api/refcodetasks/' + refcodetaskObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', refcodetask.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Refcodetask with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/refcodetasks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Refcodetask is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Refcodetask which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Refcodetask
    request(app).get('/api/refcodetasks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Refcodetask with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Refcodetask if signed in', function (done) {
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

        // Save a new Refcodetask
        agent.post('/api/refcodetasks')
          .send(refcodetask)
          .expect(200)
          .end(function (refcodetaskSaveErr, refcodetaskSaveRes) {
            // Handle Refcodetask save error
            if (refcodetaskSaveErr) {
              return done(refcodetaskSaveErr);
            }

            // Delete an existing Refcodetask
            agent.delete('/api/refcodetasks/' + refcodetaskSaveRes.body._id)
              .send(refcodetask)
              .expect(200)
              .end(function (refcodetaskDeleteErr, refcodetaskDeleteRes) {
                // Handle refcodetask error error
                if (refcodetaskDeleteErr) {
                  return done(refcodetaskDeleteErr);
                }

                // Set assertions
                (refcodetaskDeleteRes.body._id).should.equal(refcodetaskSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Refcodetask if not signed in', function (done) {
    // Set Refcodetask user
    refcodetask.user = user;

    // Create new Refcodetask model instance
    var refcodetaskObj = new Refcodetask(refcodetask);

    // Save the Refcodetask
    refcodetaskObj.save(function () {
      // Try deleting Refcodetask
      request(app).delete('/api/refcodetasks/' + refcodetaskObj._id)
        .expect(403)
        .end(function (refcodetaskDeleteErr, refcodetaskDeleteRes) {
          // Set message assertion
          (refcodetaskDeleteRes.body.message).should.match('User is not authorized');

          // Handle Refcodetask error error
          done(refcodetaskDeleteErr);
        });

    });
  });

  it('should be able to get a single Refcodetask that has an orphaned user reference', function (done) {
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

          // Save a new Refcodetask
          agent.post('/api/refcodetasks')
            .send(refcodetask)
            .expect(200)
            .end(function (refcodetaskSaveErr, refcodetaskSaveRes) {
              // Handle Refcodetask save error
              if (refcodetaskSaveErr) {
                return done(refcodetaskSaveErr);
              }

              // Set assertions on new Refcodetask
              (refcodetaskSaveRes.body.name).should.equal(refcodetask.name);
              should.exist(refcodetaskSaveRes.body.user);
              should.equal(refcodetaskSaveRes.body.user._id, orphanId);

              // force the Refcodetask to have an orphaned user reference
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

                    // Get the Refcodetask
                    agent.get('/api/refcodetasks/' + refcodetaskSaveRes.body._id)
                      .expect(200)
                      .end(function (refcodetaskInfoErr, refcodetaskInfoRes) {
                        // Handle Refcodetask error
                        if (refcodetaskInfoErr) {
                          return done(refcodetaskInfoErr);
                        }

                        // Set assertions
                        (refcodetaskInfoRes.body._id).should.equal(refcodetaskSaveRes.body._id);
                        (refcodetaskInfoRes.body.name).should.equal(refcodetask.name);
                        should.equal(refcodetaskInfoRes.body.user, undefined);

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
      Refcodetask.remove().exec(done);
    });
  });
});
