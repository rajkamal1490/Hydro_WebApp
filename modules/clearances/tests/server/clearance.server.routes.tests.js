'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Clearance = mongoose.model('Clearance'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  clearance;

/**
 * Clearance routes tests
 */
describe('Clearance CRUD tests', function () {

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

    // Save a user to the test db and create new Clearance
    user.save(function () {
      clearance = {
        name: 'Clearance name'
      };

      done();
    });
  });

  it('should be able to save a Clearance if logged in', function (done) {
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

        // Save a new Clearance
        agent.post('/api/clearances')
          .send(clearance)
          .expect(200)
          .end(function (clearanceSaveErr, clearanceSaveRes) {
            // Handle Clearance save error
            if (clearanceSaveErr) {
              return done(clearanceSaveErr);
            }

            // Get a list of Clearances
            agent.get('/api/clearances')
              .end(function (clearancesGetErr, clearancesGetRes) {
                // Handle Clearances save error
                if (clearancesGetErr) {
                  return done(clearancesGetErr);
                }

                // Get Clearances list
                var clearances = clearancesGetRes.body;

                // Set assertions
                (clearances[0].user._id).should.equal(userId);
                (clearances[0].name).should.match('Clearance name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Clearance if not logged in', function (done) {
    agent.post('/api/clearances')
      .send(clearance)
      .expect(403)
      .end(function (clearanceSaveErr, clearanceSaveRes) {
        // Call the assertion callback
        done(clearanceSaveErr);
      });
  });

  it('should not be able to save an Clearance if no name is provided', function (done) {
    // Invalidate name field
    clearance.name = '';

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

        // Save a new Clearance
        agent.post('/api/clearances')
          .send(clearance)
          .expect(400)
          .end(function (clearanceSaveErr, clearanceSaveRes) {
            // Set message assertion
            (clearanceSaveRes.body.message).should.match('Please fill Clearance name');

            // Handle Clearance save error
            done(clearanceSaveErr);
          });
      });
  });

  it('should be able to update an Clearance if signed in', function (done) {
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

        // Save a new Clearance
        agent.post('/api/clearances')
          .send(clearance)
          .expect(200)
          .end(function (clearanceSaveErr, clearanceSaveRes) {
            // Handle Clearance save error
            if (clearanceSaveErr) {
              return done(clearanceSaveErr);
            }

            // Update Clearance name
            clearance.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Clearance
            agent.put('/api/clearances/' + clearanceSaveRes.body._id)
              .send(clearance)
              .expect(200)
              .end(function (clearanceUpdateErr, clearanceUpdateRes) {
                // Handle Clearance update error
                if (clearanceUpdateErr) {
                  return done(clearanceUpdateErr);
                }

                // Set assertions
                (clearanceUpdateRes.body._id).should.equal(clearanceSaveRes.body._id);
                (clearanceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Clearances if not signed in', function (done) {
    // Create new Clearance model instance
    var clearanceObj = new Clearance(clearance);

    // Save the clearance
    clearanceObj.save(function () {
      // Request Clearances
      request(app).get('/api/clearances')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Clearance if not signed in', function (done) {
    // Create new Clearance model instance
    var clearanceObj = new Clearance(clearance);

    // Save the Clearance
    clearanceObj.save(function () {
      request(app).get('/api/clearances/' + clearanceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', clearance.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Clearance with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/clearances/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Clearance is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Clearance which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Clearance
    request(app).get('/api/clearances/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Clearance with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Clearance if signed in', function (done) {
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

        // Save a new Clearance
        agent.post('/api/clearances')
          .send(clearance)
          .expect(200)
          .end(function (clearanceSaveErr, clearanceSaveRes) {
            // Handle Clearance save error
            if (clearanceSaveErr) {
              return done(clearanceSaveErr);
            }

            // Delete an existing Clearance
            agent.delete('/api/clearances/' + clearanceSaveRes.body._id)
              .send(clearance)
              .expect(200)
              .end(function (clearanceDeleteErr, clearanceDeleteRes) {
                // Handle clearance error error
                if (clearanceDeleteErr) {
                  return done(clearanceDeleteErr);
                }

                // Set assertions
                (clearanceDeleteRes.body._id).should.equal(clearanceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Clearance if not signed in', function (done) {
    // Set Clearance user
    clearance.user = user;

    // Create new Clearance model instance
    var clearanceObj = new Clearance(clearance);

    // Save the Clearance
    clearanceObj.save(function () {
      // Try deleting Clearance
      request(app).delete('/api/clearances/' + clearanceObj._id)
        .expect(403)
        .end(function (clearanceDeleteErr, clearanceDeleteRes) {
          // Set message assertion
          (clearanceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Clearance error error
          done(clearanceDeleteErr);
        });

    });
  });

  it('should be able to get a single Clearance that has an orphaned user reference', function (done) {
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

          // Save a new Clearance
          agent.post('/api/clearances')
            .send(clearance)
            .expect(200)
            .end(function (clearanceSaveErr, clearanceSaveRes) {
              // Handle Clearance save error
              if (clearanceSaveErr) {
                return done(clearanceSaveErr);
              }

              // Set assertions on new Clearance
              (clearanceSaveRes.body.name).should.equal(clearance.name);
              should.exist(clearanceSaveRes.body.user);
              should.equal(clearanceSaveRes.body.user._id, orphanId);

              // force the Clearance to have an orphaned user reference
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

                    // Get the Clearance
                    agent.get('/api/clearances/' + clearanceSaveRes.body._id)
                      .expect(200)
                      .end(function (clearanceInfoErr, clearanceInfoRes) {
                        // Handle Clearance error
                        if (clearanceInfoErr) {
                          return done(clearanceInfoErr);
                        }

                        // Set assertions
                        (clearanceInfoRes.body._id).should.equal(clearanceSaveRes.body._id);
                        (clearanceInfoRes.body.name).should.equal(clearance.name);
                        should.equal(clearanceInfoRes.body.user, undefined);

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
      Clearance.remove().exec(done);
    });
  });
});
