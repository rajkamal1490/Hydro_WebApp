'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  File = mongoose.model('File'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  file;

/**
 * File routes tests
 */
describe('File CRUD tests', function () {

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

    // Save a user to the test db and create new File
    user.save(function () {
      file = {
        name: 'File name'
      };

      done();
    });
  });

  it('should be able to save a File if logged in', function (done) {
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

        // Save a new File
        agent.post('/api/files')
          .send(file)
          .expect(200)
          .end(function (fileSaveErr, fileSaveRes) {
            // Handle File save error
            if (fileSaveErr) {
              return done(fileSaveErr);
            }

            // Get a list of Files
            agent.get('/api/files')
              .end(function (filesGetErr, filesGetRes) {
                // Handle Files save error
                if (filesGetErr) {
                  return done(filesGetErr);
                }

                // Get Files list
                var files = filesGetRes.body;

                // Set assertions
                (files[0].user._id).should.equal(userId);
                (files[0].name).should.match('File name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an File if not logged in', function (done) {
    agent.post('/api/files')
      .send(file)
      .expect(403)
      .end(function (fileSaveErr, fileSaveRes) {
        // Call the assertion callback
        done(fileSaveErr);
      });
  });

  it('should not be able to save an File if no name is provided', function (done) {
    // Invalidate name field
    file.name = '';

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

        // Save a new File
        agent.post('/api/files')
          .send(file)
          .expect(400)
          .end(function (fileSaveErr, fileSaveRes) {
            // Set message assertion
            (fileSaveRes.body.message).should.match('Please fill File name');

            // Handle File save error
            done(fileSaveErr);
          });
      });
  });

  it('should be able to update an File if signed in', function (done) {
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

        // Save a new File
        agent.post('/api/files')
          .send(file)
          .expect(200)
          .end(function (fileSaveErr, fileSaveRes) {
            // Handle File save error
            if (fileSaveErr) {
              return done(fileSaveErr);
            }

            // Update File name
            file.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing File
            agent.put('/api/files/' + fileSaveRes.body._id)
              .send(file)
              .expect(200)
              .end(function (fileUpdateErr, fileUpdateRes) {
                // Handle File update error
                if (fileUpdateErr) {
                  return done(fileUpdateErr);
                }

                // Set assertions
                (fileUpdateRes.body._id).should.equal(fileSaveRes.body._id);
                (fileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Files if not signed in', function (done) {
    // Create new File model instance
    var fileObj = new File(file);

    // Save the file
    fileObj.save(function () {
      // Request Files
      request(app).get('/api/files')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single File if not signed in', function (done) {
    // Create new File model instance
    var fileObj = new File(file);

    // Save the File
    fileObj.save(function () {
      request(app).get('/api/files/' + fileObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', file.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single File with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/files/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'File is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single File which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent File
    request(app).get('/api/files/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No File with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an File if signed in', function (done) {
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

        // Save a new File
        agent.post('/api/files')
          .send(file)
          .expect(200)
          .end(function (fileSaveErr, fileSaveRes) {
            // Handle File save error
            if (fileSaveErr) {
              return done(fileSaveErr);
            }

            // Delete an existing File
            agent.delete('/api/files/' + fileSaveRes.body._id)
              .send(file)
              .expect(200)
              .end(function (fileDeleteErr, fileDeleteRes) {
                // Handle file error error
                if (fileDeleteErr) {
                  return done(fileDeleteErr);
                }

                // Set assertions
                (fileDeleteRes.body._id).should.equal(fileSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an File if not signed in', function (done) {
    // Set File user
    file.user = user;

    // Create new File model instance
    var fileObj = new File(file);

    // Save the File
    fileObj.save(function () {
      // Try deleting File
      request(app).delete('/api/files/' + fileObj._id)
        .expect(403)
        .end(function (fileDeleteErr, fileDeleteRes) {
          // Set message assertion
          (fileDeleteRes.body.message).should.match('User is not authorized');

          // Handle File error error
          done(fileDeleteErr);
        });

    });
  });

  it('should be able to get a single File that has an orphaned user reference', function (done) {
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

          // Save a new File
          agent.post('/api/files')
            .send(file)
            .expect(200)
            .end(function (fileSaveErr, fileSaveRes) {
              // Handle File save error
              if (fileSaveErr) {
                return done(fileSaveErr);
              }

              // Set assertions on new File
              (fileSaveRes.body.name).should.equal(file.name);
              should.exist(fileSaveRes.body.user);
              should.equal(fileSaveRes.body.user._id, orphanId);

              // force the File to have an orphaned user reference
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

                    // Get the File
                    agent.get('/api/files/' + fileSaveRes.body._id)
                      .expect(200)
                      .end(function (fileInfoErr, fileInfoRes) {
                        // Handle File error
                        if (fileInfoErr) {
                          return done(fileInfoErr);
                        }

                        // Set assertions
                        (fileInfoRes.body._id).should.equal(fileSaveRes.body._id);
                        (fileInfoRes.body.name).should.equal(file.name);
                        should.equal(fileInfoRes.body.user, undefined);

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
      File.remove().exec(done);
    });
  });
});
