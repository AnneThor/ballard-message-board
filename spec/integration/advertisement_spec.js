/*

const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models/").Advertisement;

describe("routes : advertisements", () => {

  beforeEach( (done) => {
    this.advertisement;
    sequelize.sync({force: true}).then( (res) => {
      Advertisement.create({
        title: "Sample ad",
        description: "This is an ad sample"
      })
      .then( (advertisement) => {
        this.advertisement = advertisement;
        done();
      })
      .catch( (err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("GET /advertisements", () => {
    it("should return a status code 200 and all ads", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Advertisements");
        expect(body).toContain("Sample ad");
        done();
      });
    });
  });

  describe("GET /advertisements/new", () => {
    it("should render a new topic form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBe(null);
        expect(body).toContain("New Advertisement");
        done();
      });
    });
  });

  describe("POST /advertisements/create", () => {
    const newAdFields = {
      url:`${base}create`,
      form: {
        title: "blink-182 ad",
        description: "blink-182 new album"
      }
    };
    it("should create a new ad and redirect to the ad", (done) => {
      request.post(newAdFields, (err, res, body) => {
        Advertisement.findOne({where: {title: "blink-182 ad"}})
        .then( (advertisement) => {
          expect(res.statusCode).toBe(303);
          expect(advertisement.title).toBe("blink-182 ad");
          expect(advertisement.description).toBe("blink-182 new album");
          done();
        })
        .catch( (err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /advertisements/:id", () => {
    it("should render a view with the selected advertisement", (done) => {
      request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
        expect(err).toBe(null);
        expect(body).toContain(`Sample ad`);
        done();
      });
    });
  });

  describe("POST /advertisements/:id/destroy", () => {
    it("should delete an advertisement with the associated id", (done) => {
      Advertisement.all()
      .then( (advertisements) => {
        const adCountBeforeDelete = advertisements.length;
        expect(adCountBeforeDelete).toBe(1);
        request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
          Advertisement.all()
          .then( (advertisements) => {
            expect(err).toBeNull();
            expect(advertisements.length).toBe(adCountBeforeDelete-1);
            done();
          })
        });
      });
    });
  });

  describe("GET /advertisements/:id/edit", () => {
    it("should render a view with an edit advertisement form", (done) => {
      request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Advertisement");
        expect(body).toContain("Sample ad");
        done();
      });
    });
  });

  describe("POST /advertisements/:id/update", () => {
    it("should update the ad with the given id", (done) => {
      const adFields = {
        url: `${base}${this.advertisement.id}/update`,
        form: {
          title: "Sample ad revised",
          description: "This is a sample ad"
        }
      };
      request.post(adFields, (err, res, body) => {
        expect(err).toBeNull();
        Advertisement.findOne({
          where: { id: this.advertisement.id }
        })
        .then( (advertisement) => {
          expect(advertisement.title).toBe("Sample ad revised");
          done();
        });
      });
    });
  });

})

*/
