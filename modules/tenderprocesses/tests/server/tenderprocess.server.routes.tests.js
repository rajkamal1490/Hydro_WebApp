'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tenderprocess = mongoose.model('Tenderprocess'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  tenderprocess;

/**
 * Tenderprocess routes tests
 */
describe('Tenderprocess CRUD tests', function () {

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

    // Save a user to the test db and create new Tenderprocess
    user.save(function () {
      tenderprocess = {
        name: 'Tenderprocess name'
      };

      done();
    });
  });

  it('should be able to save a Tenderprocess if logged in', function (done) {
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

        // Save a new Tenderprocess
        agent.post('/api/tenderprocesses')
          .send(tenderprocess)
          .expect(200)
          .end(function (tenderprocessSaveErr, tenderprocessSaveRes) {
            // Handle Tenderprocess save error
            if (tenderprocessSaveErr) {
              return done(tenderprocessSaveErr);
            }

            // Get a list of Tenderprocesses
            agent.get('/api/tenderprocesses')
              .end(function (tenderprocessesGetErr, tenderprocessesGetRes) {
                // Handle Tenderprocesses save error
                if (tenderprocessesGetErr) {
                  return done(tenderprocessesGetErr);
                }

                // Get Tenderprocesses list
                var tenderprocesses = tenderprocessesGetRes.body;

                // Set assertions
                (tenderprocesses[0].user._id).should.equal(userId);
                (tenderprocesses[0].name).should.match('Tenderprocess name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Tenderprocess if not logged in', function (done) {
    agent.post('/api/tenderprocesses')
      .send(tenderprocess)
      .expect(403)
      .end(function (tenderprocessSaveErr, tenderprocessSaveRes) {
        // Call the assertion callback
        done(tenderprocessSaveErr);
      });
  });

  it('should not be able to save an Tenderprocess if no name is provided', function (done) {
    // Invalidate name field
    tenderprocess.name = '';

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

        // Save a new Tenderprocess
        agent.post('/api/tenderprocesses')
          .send(tenderprocess)
          .expect(400)
          .end(function (tenderprocessSaveErr, tenderprocessSaveRes) {
            // Set message assertion
            (tenderprocessSaveRes.body.message).should.match('Please fill Tenderprocess name');

            // Handle Tenderprocess save error
            done(tenderprocessSaveErr);
          });
      });
  });

  it('should be able to update an Tenderprocess if signed in', function (done) {
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

        // Save a new Tenderprocess
        agent.post('/api/tenderprocesses')
          .send(tenderprocess)
          .expect(200)
          .end(function (tenderprocessSaveErr, tenderprocessSaveRes) {
            // Handle Tenderprocess save error
            if (tenderprocessSaveErr) {
              return done(tenderprocessSaveErr);
            }

            // Update Tenderprocess name
            tenderprocess.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Tenderprocess
            agent.put('/api/tenderprocesses/' + tenderprocessSaveRes.body._id)
              .send(tenderprocess)
              .expect(200)
              .end(function (tenderprocessUpdateErr, tenderprocessUpdateRes) {
                // Handle Tenderprocess update error
                if (tenderprocessUpdateErr) {
                  return done(tenderprocessUpdateErr);
                }

                // Set assertions
                (tenderprocessUpdateRes.body._id).should.equal(tenderprocessSaveRes.body._id);
                (tenderprocessUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tenderprocesses if not signed in', function (done) {
    // Create new Tenderprocess model instance
    var tenderprocessObj = new Tenderprocess(tenderprocess);

    // Save the tenderprocess
    tenderprocessObj.save(function () {
      // Request Tenderprocesses
      request(app).get('/api/tenderprocesses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Tenderprocess if not signed in', function (done) {
    // Create new Tenderprocess model instance
    var tenderprocessObj = new Tenderprocess(tenderprocess);

    // Save the Tenderprocess
    tenderprocessObj.save(function () {
      request(app).get('/api/tenderprocesses/' + tenderprocessObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', tenderprocess.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Tenderprocess with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tenderprocesses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tenderprocess is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Tenderprocess which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Tenderprocess
    request(app).get('/api/tenderprocesses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Tenderprocess with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Tenderprocess if signed in', function (done) {
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

        // Save a new Tenderprocess
        agent.post('/api/tenderprocesses')
          .send(tenderprocess)
          .expect(200)
          .end(function (tenderprocessSaveErr, tenderprocessSaveRes) {
            // Handle Tenderprocess save error
            if (tenderprocessSaveErr) {
              return done(tenderprocessSaveErr);
            }

            // Delete an existing Tenderprocess
            agent.delete('/api/tenderprocesses/' + tenderprocessSaveRes.body._id)
              .send(tenderprocess)
              .expect(200)
              .end(function (tenderprocessDeleteErr, tenderprocessDeleteRes) {
                // Handle tenderprocess error error
                if (tenderprocessDeleteErr) {
                  return done(tenderprocessDeleteErr);
                }

                // Set assertions
                (tenderprocessDeleteRes.body._id).should.equal(tenderprocessSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Tenderprocess if not signed in', function (done) {
    // Set Tenderprocess user
    tenderprocess.user = user;

    // Create new Tenderprocess model instance
    var tenderprocessObj = new Tenderprocess(tenderprocess);

    // Save the Tenderprocess
    tenderprocessObj.save(function () {
      // Try deleting Tenderprocess
      request(app).delete('/api/tenderprocesses/' + tenderprocessObj._id)
        .expect(403)
        .end(function (tenderprocessDeleteErr, tenderprocessDeleteRes) {
          // Set message assertion
          (tenderprocessDeleteRes.body.message).should.match('User is not authorized');

          // Handle Tenderprocess error error
          done(tenderprocessDeleteErr);
        });

    });
  });

  it('should be able to get a single Tenderprocess that has an orphaned user reference', function (done) {
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

          // Save a new Tenderprocess
          agent.post('/api/tenderprocesses')
            .send(tenderprocess)
            .expect(200)
            .end(function (tenderprocessSaveErr, tenderprocessSaveRes) {
              // Handle Tenderprocess save error
              if (tenderprocessSaveErr) {
                return done(tenderprocessSaveErr);
              }

              // Set assertions on new Tenderprocess
              (tenderprocessSaveRes.body.name).should.equal(tenderprocess.name);
              should.exist(tenderprocessSaveRes.body.user);
              should.equal(tenderprocessSaveRes.body.user._id, orphanId);

              // force the Tenderprocess to have an orphaned user reference
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

                    // Get the Tenderprocess
                    agent.get('/api/tenderprocesses/' + tenderprocessSaveRes.body._id)
                      .expect(200)
                      .end(function (tenderprocessInfoErr, tenderprocessInfoRes) {
                        // Handle Tenderprocess error
                        if (tenderprocessInfoErr) {
                          return done(tenderprocessInfoErr);
                        }

                        // Set assertions
                        (tenderprocessInfoRes.body._id).should.equal(tenderprocessSaveRes.body._id);
                        (tenderprocessInfoRes.body.name).should.equal(tenderprocess.name);
                        should.equal(tenderprocessInfoRes.body.user, undefined);

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
      Tenderprocess.remove().exec(done);
    });
  });
});
