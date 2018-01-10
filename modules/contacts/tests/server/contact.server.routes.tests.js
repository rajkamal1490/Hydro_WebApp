'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contact = mongoose.model('Contact'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  contact;

/**
 * Contact routes tests
 */
describe('Contact CRUD tests', function () {

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

    // Save a user to the test db and create new Contact
    user.save(function () {
      contact = {
        name: 'Contact name'
      };

      done();
    });
  });

  it('should be able to save a Contact if logged in', function (done) {
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

        // Save a new Contact
        agent.post('/api/contacts')
          .send(contact)
          .expect(200)
          .end(function (contactSaveErr, contactSaveRes) {
            // Handle Contact save error
            if (contactSaveErr) {
              return done(contactSaveErr);
            }

            // Get a list of Contacts
            agent.get('/api/contacts')
              .end(function (contactsGetErr, contactsGetRes) {
                // Handle Contacts save error
                if (contactsGetErr) {
                  return done(contactsGetErr);
                }

                // Get Contacts list
                var contacts = contactsGetRes.body;

                // Set assertions
                (contacts[0].user._id).should.equal(userId);
                (contacts[0].name).should.match('Contact name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Contact if not logged in', function (done) {
    agent.post('/api/contacts')
      .send(contact)
      .expect(403)
      .end(function (contactSaveErr, contactSaveRes) {
        // Call the assertion callback
        done(contactSaveErr);
      });
  });

  it('should not be able to save an Contact if no name is provided', function (done) {
    // Invalidate name field
    contact.name = '';

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

        // Save a new Contact
        agent.post('/api/contacts')
          .send(contact)
          .expect(400)
          .end(function (contactSaveErr, contactSaveRes) {
            // Set message assertion
            (contactSaveRes.body.message).should.match('Please fill Contact name');

            // Handle Contact save error
            done(contactSaveErr);
          });
      });
  });

  it('should be able to update an Contact if signed in', function (done) {
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

        // Save a new Contact
        agent.post('/api/contacts')
          .send(contact)
          .expect(200)
          .end(function (contactSaveErr, contactSaveRes) {
            // Handle Contact save error
            if (contactSaveErr) {
              return done(contactSaveErr);
            }

            // Update Contact name
            contact.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Contact
            agent.put('/api/contacts/' + contactSaveRes.body._id)
              .send(contact)
              .expect(200)
              .end(function (contactUpdateErr, contactUpdateRes) {
                // Handle Contact update error
                if (contactUpdateErr) {
                  return done(contactUpdateErr);
                }

                // Set assertions
                (contactUpdateRes.body._id).should.equal(contactSaveRes.body._id);
                (contactUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Contacts if not signed in', function (done) {
    // Create new Contact model instance
    var contactObj = new Contact(contact);

    // Save the contact
    contactObj.save(function () {
      // Request Contacts
      request(app).get('/api/contacts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Contact if not signed in', function (done) {
    // Create new Contact model instance
    var contactObj = new Contact(contact);

    // Save the Contact
    contactObj.save(function () {
      request(app).get('/api/contacts/' + contactObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', contact.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Contact with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/contacts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Contact is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Contact which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Contact
    request(app).get('/api/contacts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Contact with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Contact if signed in', function (done) {
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

        // Save a new Contact
        agent.post('/api/contacts')
          .send(contact)
          .expect(200)
          .end(function (contactSaveErr, contactSaveRes) {
            // Handle Contact save error
            if (contactSaveErr) {
              return done(contactSaveErr);
            }

            // Delete an existing Contact
            agent.delete('/api/contacts/' + contactSaveRes.body._id)
              .send(contact)
              .expect(200)
              .end(function (contactDeleteErr, contactDeleteRes) {
                // Handle contact error error
                if (contactDeleteErr) {
                  return done(contactDeleteErr);
                }

                // Set assertions
                (contactDeleteRes.body._id).should.equal(contactSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Contact if not signed in', function (done) {
    // Set Contact user
    contact.user = user;

    // Create new Contact model instance
    var contactObj = new Contact(contact);

    // Save the Contact
    contactObj.save(function () {
      // Try deleting Contact
      request(app).delete('/api/contacts/' + contactObj._id)
        .expect(403)
        .end(function (contactDeleteErr, contactDeleteRes) {
          // Set message assertion
          (contactDeleteRes.body.message).should.match('User is not authorized');

          // Handle Contact error error
          done(contactDeleteErr);
        });

    });
  });

  it('should be able to get a single Contact that has an orphaned user reference', function (done) {
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

          // Save a new Contact
          agent.post('/api/contacts')
            .send(contact)
            .expect(200)
            .end(function (contactSaveErr, contactSaveRes) {
              // Handle Contact save error
              if (contactSaveErr) {
                return done(contactSaveErr);
              }

              // Set assertions on new Contact
              (contactSaveRes.body.name).should.equal(contact.name);
              should.exist(contactSaveRes.body.user);
              should.equal(contactSaveRes.body.user._id, orphanId);

              // force the Contact to have an orphaned user reference
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

                    // Get the Contact
                    agent.get('/api/contacts/' + contactSaveRes.body._id)
                      .expect(200)
                      .end(function (contactInfoErr, contactInfoRes) {
                        // Handle Contact error
                        if (contactInfoErr) {
                          return done(contactInfoErr);
                        }

                        // Set assertions
                        (contactInfoRes.body._id).should.equal(contactSaveRes.body._id);
                        (contactInfoRes.body.name).should.equal(contact.name);
                        should.equal(contactInfoRes.body.user, undefined);

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
      Contact.remove().exec(done);
    });
  });
});
