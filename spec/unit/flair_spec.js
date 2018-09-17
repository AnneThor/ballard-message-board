const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe( "Flair", () => {

  beforeEach( (done) => {
    this.topic;
    this.flair;
    sequelize.sync({force:true}).then( (res) => {
      Topic.create({
        title: "Test Topic Is Long enough?",
        description: "Test description is failing validation I think!!",
      })
      .then( (topic) => {
        this.topic = topic;
        Flair.create({
          name: "Test Flair",
          color: "black",
          topicId: this.topic.id,
        })
        .then( (flair) => {
          this.flair = flair;
          done();
        })
      })
    .catch( (err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#create()", () => {

    it("should create a flair object with a name and color", (done) => {
      Flair.create({
        name: "Happy flair",
        color: "pink",
        topicId: this.topic.id,
      })
      .then( (flair) => {
        expect(flair.name).toBe("Happy flair");
        expect(flair.color).toBe("pink");
        expect(flair.topicId).toBe(this.topic.id);
        done();
      })
      .catch( (err) => {
        console.log(err);
        done();
      });
    });

    it("should not allow a flair item to be created without name or color", (done) => {
      Flair.create({
        name: "Flair with no color",
      })
      .then( (flair) => {
        //this will not evaluate bc we expect the flair will not be created
        done();
      })
      .catch( err => {
        expect(err.message).toContain("Flair.color cannot be null");
        done();
      });
    });

  });

});
