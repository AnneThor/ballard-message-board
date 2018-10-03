const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;
const base = "http://localhost:3000/topics/";
const request = require("request");
const server = require("../../src/server");

describe("Post", () => {

    beforeEach((done) => {
      this.topic;
      this.post;
      this.user;
      sequelize.sync({force: true}).then((res) => {

        User.create({
          email: "starman@tesla.com",
          password: "Trekkie4lyfe",
        })
        .then( user => {
          this.user = user; //store the user
          Topic.create({
            title: "Expeditions to Alpha Centauri",
            description: "A compilation of reports.",
            posts: [{
              title: "My first visit to Proxima Centauri b",
              body: "I saw some rocks.",
              userId: this.user.id
            }]
          }, {
            include: {
              model: Post,
              as: "posts",
            }
          })
          .then( topic => {
            this.topic = topic; //store the topic
            this.post = topic.posts[0]; //store the post
            done();
          })
        })
      });
    });

  describe("#create()", () => {

    it("should create a post object with a title, body, topic and user", (done) => {
      Post.create({
        title: "Pros of cryosleep during the long journey",
        body: "1. Not having to answer the 'are we there yet?' question.",
        topicId: this.topic.id,
        userId: this.user.id,
      })
      .then( (post) => {
        expect(post.title).toBe("Pros of cryosleep during the long journey");
        expect(post.body).toBe("1. Not having to answer the 'are we there yet?' question.");
        expect(post.topicId).toBe(this.topic.id);
        expect(post.userId).toBe(this.user.id);
        done();
      })
      .catch( (err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a post with missing title, body or assigned topic", (done) => {
      Post.create({
        title: "Pros of Cryosleep during the long journey"
      })
      .then( (post) => {
        //expect an error therefore this code does not run
        done();
      })
      .catch( (err) => {
        expect(err.message).toContain("Post.body cannot be null");
        expect(err.message).toContain("Post.topicId cannot be null");
        done();
      })
    });

  });

  describe("#getTopic()", () => {
    it("should return the associated topic", (done) => {
      this.post.getTopic()
      .then( (associatedTopic) => {
        expect(associatedTopic.title).toBe("Expeditions to Alpha Centauri");
        done();
      })
    })
  })

  describe("#setTopic()", () => {
    it("should associate a topic and a post together", (done) => {
      Topic.create({
        title: "Challenger of interstellar travel",
        description: "1. The Wi-Fi is terrible"
      })
      .then( (newTopic) => {
        expect(this.post.topicId).toBe(this.topic.id);
        this.post.setTopic(newTopic)
        .then( (post) => {
          expect(post.topicId).toBe(newTopic.id);
          done();
        });
      });
    });
  });

  describe("#setUser()", () => {
    it("should associate a post and a user together", done => {
      User.create({
        email: "ada@example.com",
        password: "password",
      })
      .then( newUser => {
        expect(this.post.userId).toBe(this.user.id);
        this.post.setUser(newUser)
        .then( post => {
            expect(this.post.userId).toBe(newUser.id);
            done();
        });
      })
    });
  });

  describe("#getUser()", () => {
    it("should return the associated topic", done => {
      this.post.getUser()
      .then( associatedUser => {
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
      });
    });
  });

  describe("#getPoints()", () => {

    beforeEach( done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member",
          email: "example@example.com",
          id: this.user.id,
        }
      }, (err, res, body) => {
        done();
      });
    });

    it("should return the total number of points for the given post", done => {
      Post.findById(this.post.id, {
        include: [
          { model: Vote, as: "votes" }
        ]
      })
      .then( post => {
        expect(post.getPoints()).toBe(0);
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      })
    });

    it("should return the total number of points for the given post", done => {
      const options = {
        url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`,
      };
      request.get(options, (err, res, body) => {

        Post.findById(this.post.id, {
          include: [
            { model: Vote, as: "votes" }
          ]
        })
        .then( post => {
          expect(post.getPoints()).toBe(1);
          done();
        })
        .catch( err => {
          console.log(err);
          done();
        })
      });
    });

  });


  describe("#hasUpvoteFor()", () => {

    beforeEach( done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member",
          email: "example@example.com",
          id: this.user.id,
        }
      }, (err, res, body) => {
        done();
      });
    });

    it("should return false because the user does not have an upvote", done => {
      Post.findById(this.post.id, {
        include: [
          { model: Vote, as: "votes" }
        ]
      })
      .then( post => {
        expect(post.hasUpvoteFor(this.user.id)).toBe(false);
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      })
    });

    it("should return true because the user has upvoted the post", done => {
      const options = {
        url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`,
      };
      request.get(options, (err, res, body) => {
          Post.findById(this.post.id, {
            include: [
              { model: Vote, as: "votes" }
            ]
          })
          .then( post => {
            expect(post.getPoints()).toBe(1);
            expect(post.hasUpvoteFor(this.user.id)).toBe(true);
            done();
          })
          .catch( err => {
            console.log(err);
            done();
          })
        });
    });

  });

  describe("#hasDownvoteFor()", () => {

    beforeEach( done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member",
          email: "example@example.com",
          id: this.user.id,
        }
      }, (err, res, body) => {
        done();
      });
    });

    it("should return false because the user does not have a downvote", done => {
      Post.findById(this.post.id, {
        include: [
          { model: Vote, as: "votes" }
        ]
      })
      .then( post => {
        expect(post.hasDownvoteFor(this.user.id)).toBe(false);
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      })
    });

    it("should return true because the user has downvoted the post", done => {
      const options = {
        url: `${base}${this.topic.id}/posts/${this.post.id}/votes/downvote`,
      };
      request.get(options, (err, res, body) => {
          Post.findById(this.post.id, {
            include: [
              { model: Vote, as: "votes" }
            ]
          })
          .then( post => {
            expect(post.getPoints()).toBe(-1);
            expect(post.hasDownvoteFor(this.user.id)).toBe(true);
            done();
          })
          .catch( err => {
            console.log(err);
            done();
          })
        });
    });

  });

});
