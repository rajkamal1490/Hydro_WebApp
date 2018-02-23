'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  FileManager = mongoose.model('FileManager'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  fileManager;

/**
 * File manager routes tests
 */
describe('File manager CRUD tests', function () {

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

    // Save a user to the test db and create new File manager
    user.save(function () {
      fileManager = {
        name: 'File manager name'
      };

      done();
    });
  });

  it('should be able to save a File manager if logged in', function (done) {
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

        // Save a new File manager
        agent.post('/api/fileManagers')
          .send(fileManager)
          .expect(200)
          .end(function (fileManagerSaveErr, fileManagerSaveRes) {
            // Handle File manager save error
            if (fileManagerSaveErr) {
              return done(fileManagerSaveErr);
            }

            // Get a list of File managers
            agent.get('/api/fileManagers')
              .end(function (fileManagersGetErr, fileManagersGetRes) {
                // Handle File managers save error
                if (fileManagersGetErr) {
                  return done(fileManagersGetErr);
                }

                // Get File managers list
                var fileManagers = fileManagersGetRes.body;

                // Set assertions
                (fileManagers[0].user._id).should.equal(userId);
                (fileManagers[0].name).should.match('File manager name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an File manager if not logged in', function (done) {
    agent.post('/api/fileManagers')
      .send(fileManager)
      .expect(403)
      .end(function (fileManagerSaveErr, fileManagerSaveRes) {
        // Call the assertion callback
        done(fileManagerSaveErr);
      });
  });

  it('should not be able to save an File manager if no name is provided', function (done) {
    // Invalidate name field
    fileManager.name = '';

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

        // Save a new File manager
        agent.post('/api/fileManagers')
          .send(fileManager)
          .expect(400)
          .end(function (fileManagerSaveErr, fileManagerSaveRes) {
            // Set message assertion
            (fileManagerSaveRes.body.message).should.match('Please fill File manager name');

            // Handle File manager save error
            done(fileManagerSaveErr);
          });
      });
  });

  it('should be able to update an File manager if signed in', function (done) {
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

        // Save a new File manager
        agent.post('/api/fileManagers')
          .send(fileManager)
          .expect(200)
          .end(function (fileManagerSaveErr, fileManagerSaveRes) {
            // Handle File manager save error
            if (fileManagerSaveErr) {
              return done(fileManagerSaveErr);
            }

            // Update File manager name
            fileManager.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing File manager
            agent.put('/api/fileManagers/' + fileManagerSaveRes.body._id)
              .send(fileManager)
              .expect(200)
              .end(function (fileManagerUpdateErr, fileManagerUpdateRes) {
                // Handle File manager update error
                if (fileManagerUpdateErr) {
                  return done(fileManagerUpdateErr);
                }

                // Set assertions
                (fileManagerUpdateRes.body._id).should.equal(fileManagerSaveRes.body._id);
                (fileManagerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of File managers if not signed in', function (done) {
    // Create new File manager model instance
    var fileManagerObj = new FileManager(fileManager);

    // Save the fileManager
    fileManagerObj.save(function () {
      // Request File managers
      request(app).get('/api/fileManagers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single File manager if not signed in', function (done) {
    // Create new File manager model instance
    var fileManagerObj = new FileManager(fileManager);

    // Save the File manager
    fileManagerObj.save(function () {
      request(app).get('/api/fileManagers/' + fileManagerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', fileManager.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single File manager with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/fileManagers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'File manager is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single File manager which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent File manager
    request(app).get('/api/fileManagers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No File manager with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an File manager if signed in', function (done) {
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

        // Save a new File manager
        agent.post('/api/fileManagers')
          .send(fileManager)
          .expect(200)
          .end(function (fileManagerSaveErr, fileManagerSaveRes) {
            // Handle File manager save error
            if (fileManagerSaveErr) {
              return done(fileManagerSaveErr);
            }

            // Delete an existing File manager
            agent.delete('/api/fileManagers/' + fileManagerSaveRes.body._id)
              .send(fileManager)
              .expect(200)
              .end(function (fileManagerDeleteErr, fileManagerDeleteRes) {
                // Handle fileManager error error
                if (fileManagerDeleteErr) {
                  return done(fileManagerDeleteErr);
                }

                // Set assertions
                (fileManagerDeleteRes.body._id).should.equal(fileManagerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an File manager if not signed in', function (done) {
    // Set File manager user
    fileManager.user = user;

    // Create new File manager model instance
    var fileManagerObj = new FileManager(fileManager);

    // Save the File manager
    fileManagerObj.save(function () {
      // Try deleting File manager
      request(app).delete('/api/fileManagers/' + fileManagerObj._id)
        .expect(403)
        .end(function (fileManagerDeleteErr, fileManagerDeleteRes) {
          // Set message assertion
          (fileManagerDeleteRes.body.message).should.match('User is not authorized');

          // Handle File manager error error
          done(fileManagerDeleteErr);
        });

    });
  });

  it('should be able to get a single File manager that has an orphaned user reference', function (done) {
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

          // Save a new File manager
          agent.post('/api/fileManagers')
            .send(fileManager)
            .expect(200)
            .end(function (fileManagerSaveErr, fileManagerSaveRes) {
              // Handle File manager save error
              if (fileManagerSaveErr) {
                return done(fileManagerSaveErr);
              }

              // Set assertions on new File manager
              (fileManagerSaveRes.body.name).should.equal(fileManager.name);
              should.exist(fileManagerSaveRes.body.user);
              should.equal(fileManagerSaveRes.body.user._id, orphanId);

              // force the File manager to have an orphaned user reference
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

                    // Get the File manager
                    agent.get('/api/fileManagers/' + fileManagerSaveRes.body._id)
                      .expect(200)
                      .end(function (fileManagerInfoErr, fileManagerInfoRes) {
                        // Handle File manager error
                        if (fileManagerInfoErr) {
                          return done(fileManagerInfoErr);
                        }

                        // Set assertions
                        (fileManagerInfoRes.body._id).should.equal(fileManagerSaveRes.body._id);
                        (fileManagerInfoRes.body.name).should.equal(fileManager.name);
                        should.equal(fileManagerInfoRes.body.user, undefined);

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
      FileManager.remove().exec(done);
    });
  });
});
