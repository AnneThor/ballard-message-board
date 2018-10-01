const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

  beforeEach( done => {
    this.user;
    this.topic;
    this.post;
    this.comment;
    sequelize.sync({force: true}).then( res => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
      })
      .then( user => {
        this.user = user;
        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks",
            userId: this.user.id,
          }]
        }, {
          include: {
            model: Post,
            as: "posts",
          }
        })
        .then( topic => {
          this.topic = topic;
          this.post = this.topic.posts[0];
          Comment.create({
            body: "ay caramba!!!!!",
            userId: this.user.id,
            postId: this.post.id,
          })
          .then( comment => {
            this.comment = comment;
            done();
          })
          .catch( err => {
            console.log(err);
            done();
          });
        })
        .catch( err => {
          console.log(err);
          done();
        });
      });
    });
  });

//Test suites will go here

  describe("guest attempting to perform CRUD actions for Comment", () => {

    beforeEach( done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0 //flag to indicate not logged in, destroy any session
        }
      }, (err, res, body) => {
        done();
      });
    });

    describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

      it("should not create a new comment", done => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
          form: {
            body: "This comment is amazing!",
          },
        };
        request.post(options, (err, res, body) => {
          Comment.findOne({where: {body: "This comment is amazing!"}})
          .then( comment => {
            expect(comment).toBeNull();
            done();
          })
          .catch( err => {
            console.log(err);
            done();
          });
        });
      });
    }); //closes tests for guest/create

    describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

      it("should not delete the comment with the associated id", done => {
        Comment.all()
        .then( comments => {
          const commentCountBeforeDelete = comments.length;
          expect(commentCountBeforeDelete).toBe(1);
          request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
            (err, res, body) => {
              Comment.all()
              .then( comments => {
                expect(err).toBeNull();
                expect(comments.length).toBe(commentCountBeforeDelete);
                done();
              })
            });
        })
      }); //closes should not delete comment test
    }); //closes describe guest/destroy

  }); //closes guest test suite

  describe("signed in user performing CRUD actions for Comment", () => {

    beforeEach( done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member",
          email: this.user.email,
          id: this.user.id,
        }
      }, (err, res, body) => {
        done();
      });
    })

    describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

      it("should create a new comment and redirect", (done) => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
          form: {
            body: "This comment is amazing!",
          }
        };
        request.post(options, (err, res, body) => {
          Comment.findOne({where: {body: "This comment is amazing!"}})
          .then( comment => {
            expect(comment).not.toBeNull();
            expect(comment.body).toBe("This comment is amazing!");
            expect(comment.id).not.toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

      beforeEach( done => {
        this.secondUser;
        this.secondComment;
        User.create({
          email: "example@example.com",
          password: "password",
          role: "member",
        })
        .then( user => {
          this.secondUser = user;
          Comment.create({
            body: "This is a comment that this.user cannot delete",
            postId: this.post.id,
            userId: this.secondUser.id,
          })
          .then( comment => {
            this.secondComment = comment;
            done();
          });
        });
      })

      it("should delete the comment with the associated id", done => {
        Comment.all()
        .then( comments => {
          const commentCountBeforeDelete = comments.length;
          expect(commentCountBeforeDelete).toBe(2);
          request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
            (err, res, body) => {
              expect(res.statusCode).toBe(302);
              Comment.all()
              .then( comments => {
                expect(err).toBeNull();
                expect(comments.length).toBe(commentCountBeforeDelete-1);
                done();
              })
            });
          });
        });

        it("should not delete a comment made by another user", done => {

          request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.secondComment.id}/destroy`,
            (err, res, body) => {
              expect(res.statusCode).toBe(401);
              Comment.findOne({where: {userId: this.secondUser.id}})
              .then( comment => {
                expect(err).toBeNull();
                expect(comment).not.toBeNull();
                expect(comment.body).toBe("This is a comment that this.user cannot delete");
                done();
              });
            });

        });

      }); //closes describe for member/destroy

  }); //closes suite for signed in user

  describe("admin performing CRUD actions for Comment", () => {

    beforeEach( done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "admin",
          email: this.user.email,
          id: this.user.id,
        }
      }, (err, res, body) => {
        done();
      });
    })

    describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

      it("should create a new comment and redirect", (done) => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
          form: {
            body: "This comment is amazing!",
          }
        };
        request.post(options, (err, res, body) => {
          Comment.findOne({where: {body: "This comment is amazing!"}})
          .then( comment => {
            expect(comment).not.toBeNull();
            expect(comment.body).toBe("This comment is amazing!");
            expect(comment.id).not.toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

      beforeEach( done => {
        this.secondUser;
        this.secondComment;
        User.create({
          email: "example@example.com",
          password: "password",
          role: "member",
        })
        .then( user => {
          this.secondUser = user;
          Comment.create({
            body: "This is a comment that admin user can delete",
            postId: this.post.id,
            userId: this.secondUser.id,
          })
          .then( comment => {
            this.secondComment = comment;
            done();
          });
        });
      })

      it("should delete the comment with the associated id", done => {
        Comment.all()
        .then( comments => {
          const commentCountBeforeDelete = comments.length;
          expect(commentCountBeforeDelete).toBe(2);
          request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
            (err, res, body) => {
              expect(res.statusCode).toBe(302);
              Comment.all()
              .then( comments => {
                expect(err).toBeNull();
                expect(comments.length).toBe(commentCountBeforeDelete-1);
                done();
              })
            });
          });
        });

        it("should delete a comment made by another user", done => {

          request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.secondComment.id}/destroy`,
            (err, res, body) => {
              expect(res.statusCode).toBe(302);
              Comment.findOne({where: {userId: this.secondUser.id}})
              .then( comment => {
                expect(err).toBeNull();
                expect(comment).toBeNull();
                done();
              });
            });

        });

      }); //closes describe for admin/destroy

  }); //closes suite for admin user

}); //final closing bracket
