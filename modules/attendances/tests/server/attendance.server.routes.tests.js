'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Attendance = mongoose.model('Attendance'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  attendance;

/**
 * Attendance routes tests
 */
describe('Attendance CRUD tests', function () {

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

    // Save a user to the test db and create new Attendance
    user.save(function () {
      attendance = {
        name: 'Attendance name'
      };

      done();
    });
  });

  it('should be able to save a Attendance if logged in', function (done) {
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

        // Save a new Attendance
        agent.post('/api/attendances')
          .send(attendance)
          .expect(200)
          .end(function (attendanceSaveErr, attendanceSaveRes) {
            // Handle Attendance save error
            if (attendanceSaveErr) {
              return done(attendanceSaveErr);
            }

            // Get a list of Attendances
            agent.get('/api/attendances')
              .end(function (attendancesGetErr, attendancesGetRes) {
                // Handle Attendances save error
                if (attendancesGetErr) {
                  return done(attendancesGetErr);
                }

                // Get Attendances list
                var attendances = attendancesGetRes.body;

                // Set assertions
                (attendances[0].user._id).should.equal(userId);
                (attendances[0].name).should.match('Attendance name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Attendance if not logged in', function (done) {
    agent.post('/api/attendances')
      .send(attendance)
      .expect(403)
      .end(function (attendanceSaveErr, attendanceSaveRes) {
        // Call the assertion callback
        done(attendanceSaveErr);
      });
  });

  it('should not be able to save an Attendance if no name is provided', function (done) {
    // Invalidate name field
    attendance.name = '';

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

        // Save a new Attendance
        agent.post('/api/attendances')
          .send(attendance)
          .expect(400)
          .end(function (attendanceSaveErr, attendanceSaveRes) {
            // Set message assertion
            (attendanceSaveRes.body.message).should.match('Please fill Attendance name');

            // Handle Attendance save error
            done(attendanceSaveErr);
          });
      });
  });

  it('should be able to update an Attendance if signed in', function (done) {
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

        // Save a new Attendance
        agent.post('/api/attendances')
          .send(attendance)
          .expect(200)
          .end(function (attendanceSaveErr, attendanceSaveRes) {
            // Handle Attendance save error
            if (attendanceSaveErr) {
              return done(attendanceSaveErr);
            }

            // Update Attendance name
            attendance.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Attendance
            agent.put('/api/attendances/' + attendanceSaveRes.body._id)
              .send(attendance)
              .expect(200)
              .end(function (attendanceUpdateErr, attendanceUpdateRes) {
                // Handle Attendance update error
                if (attendanceUpdateErr) {
                  return done(attendanceUpdateErr);
                }

                // Set assertions
                (attendanceUpdateRes.body._id).should.equal(attendanceSaveRes.body._id);
                (attendanceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Attendances if not signed in', function (done) {
    // Create new Attendance model instance
    var attendanceObj = new Attendance(attendance);

    // Save the attendance
    attendanceObj.save(function () {
      // Request Attendances
      request(app).get('/api/attendances')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Attendance if not signed in', function (done) {
    // Create new Attendance model instance
    var attendanceObj = new Attendance(attendance);

    // Save the Attendance
    attendanceObj.save(function () {
      request(app).get('/api/attendances/' + attendanceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', attendance.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Attendance with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/attendances/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Attendance is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Attendance which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Attendance
    request(app).get('/api/attendances/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Attendance with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Attendance if signed in', function (done) {
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

        // Save a new Attendance
        agent.post('/api/attendances')
          .send(attendance)
          .expect(200)
          .end(function (attendanceSaveErr, attendanceSaveRes) {
            // Handle Attendance save error
            if (attendanceSaveErr) {
              return done(attendanceSaveErr);
            }

            // Delete an existing Attendance
            agent.delete('/api/attendances/' + attendanceSaveRes.body._id)
              .send(attendance)
              .expect(200)
              .end(function (attendanceDeleteErr, attendanceDeleteRes) {
                // Handle attendance error error
                if (attendanceDeleteErr) {
                  return done(attendanceDeleteErr);
                }

                // Set assertions
                (attendanceDeleteRes.body._id).should.equal(attendanceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Attendance if not signed in', function (done) {
    // Set Attendance user
    attendance.user = user;

    // Create new Attendance model instance
    var attendanceObj = new Attendance(attendance);

    // Save the Attendance
    attendanceObj.save(function () {
      // Try deleting Attendance
      request(app).delete('/api/attendances/' + attendanceObj._id)
        .expect(403)
        .end(function (attendanceDeleteErr, attendanceDeleteRes) {
          // Set message assertion
          (attendanceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Attendance error error
          done(attendanceDeleteErr);
        });

    });
  });

  it('should be able to get a single Attendance that has an orphaned user reference', function (done) {
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

          // Save a new Attendance
          agent.post('/api/attendances')
            .send(attendance)
            .expect(200)
            .end(function (attendanceSaveErr, attendanceSaveRes) {
              // Handle Attendance save error
              if (attendanceSaveErr) {
                return done(attendanceSaveErr);
              }

              // Set assertions on new Attendance
              (attendanceSaveRes.body.name).should.equal(attendance.name);
              should.exist(attendanceSaveRes.body.user);
              should.equal(attendanceSaveRes.body.user._id, orphanId);

              // force the Attendance to have an orphaned user reference
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

                    // Get the Attendance
                    agent.get('/api/attendances/' + attendanceSaveRes.body._id)
                      .expect(200)
                      .end(function (attendanceInfoErr, attendanceInfoRes) {
                        // Handle Attendance error
                        if (attendanceInfoErr) {
                          return done(attendanceInfoErr);
                        }

                        // Set assertions
                        (attendanceInfoRes.body._id).should.equal(attendanceSaveRes.body._id);
                        (attendanceInfoRes.body.name).should.equal(attendance.name);
                        should.equal(attendanceInfoRes.body.user, undefined);

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
      Attendance.remove().exec(done);
    });
  });
});
