const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

  beforeEach( (done) => {
    this.topic;
    this.post;
    sequelize.sync({force:true}).then( (res) => {
      Topic.create({
        title: "New Topic for Test",
        description: "A new testing topic"
      })
      .then( (topic) => {
        this.topic = topic;
        Post.create({
          title: "Test Post 1",
          body: "Test Post Body 1",
          topicId: this.topic.id
        })
        .then( (post) => {
          this.post = post;
          done();
        });
      })
      .catch( (err) => {
        console.log(err);
        done();
      });
    });

  });

  describe("#create()", () => {

    it("should create a new topic with the given title and description", (done) => {
      Topic.create({
        title: "Dogs",
        description: "Discussion about dogs"
      })
      .then( (topic) => {
        expect(topic.title).toBe("Dogs");
        expect(topic.description).toBe("Discussion about dogs");
        done();
      })
      .catch( (err) => {
        console.log(err);
        done();
      });
    });

  });

  describe("#getPosts()", () => {

    it("should return an array of posts associated with the given topic", (done) => {
      this.topic.getPosts()
      .then( (postArray) => {
        expect(postArray.length).toBe(1);
        expect(postArray[0].title).toBe("Test Post 1");
        expect(postArray[0].body).toBe("Test Post Body 1");
        done();
      })
      .catch( (err) => {
        console.log(err);
        done();
      });
    });
  });

});
