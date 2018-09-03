const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe( "Flair", () => {

  beforeEach( (done) => {
    this.topic;
    this.flair;
    sequelize.sync({force:true}).then( (res) => {
      Flair.create({
        name: "Test Flair",
        color: "Test Color",
      })
      .then( (flair) => {
        this.flair = flair;
        Topic.create({
          title: "Test Topic",
          description: "Test description",
          flairId: this.flair.id,
        })
        .then( (topic) => {
          this.topic = topic;
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

    it("should be valid as a foreign key in a topic object", (done) => {
      Topic.create({
        title: "A test",
        description: "test topic",
        flairId: this.flair.id,
      })
      .then( topic => {
        expect(this.flair.id).toBe(1);
        expect(this.topic.flairId).toBe(1);
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });

    it("should create a flair object with a name and color", (done) => {
      Flair.create({
        name: "Happy flair",
        color: "pink",
      })
      .then( (flair) => {
        expect(flair.name).toBe("Happy flair");
        expect(flair.color).toBe("pink");
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
