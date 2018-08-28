const advertisementQueries = require("../db/queries.advertisements.js");

module.exports = {

  create(req, res, next) {
    let newAd = {
      title: req.body.title,
      description: req.body.description
    };
    advertisementQueries.addAdvertisement(newAd, (err, advertisement) => {
      if (err) {
        res.redirect(500, "/advertisements/new");
      } else {
        res.redirect(303, `/advertisements/${advertisement.id}`);
      }
    });
  },

  destroy(req, res, next) {
    advertisementQueries.deleteAdvertisement(req.params.id, (err, advertisement) => {
      if(err){
        res.redirect(500, `/advertisements/${advertisement.id}`);
      } else {
        res.redirect(303, "/advertisements");
      }
    });
  },

  edit(req, res, next) {
    advertisementQueries.getAdvertisement(req.params.id, (err, advertisement) => {
      if(err || advertisement == null) {
        res.redirect(404, "/");
      } else {
        res.render("advertisements/edit", {advertisement});
      }
    });
  },

  index(req, res, next) {
    advertisementQueries.getAllAdvertisements( (err, advertisements) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("advertisements/index", {advertisements});
      }
    })
  },

  new(req, res, next) {
    res.render("advertisements/new");
  },

  show(req, res, next) {
    advertisementQueries.getAdvertisement(req.params.id, (err, advertisement) => {
      if(err || advertisement == null) {
        res.redirect(404, "/");
      } else {
        res.render("advertisements/show", {advertisement});
      }
    })
  },

  update(req, res, next) {
    advertisementQueries.updateAdvertisement(req.params.id, req.body, (err, advertisement) => {
      if(err || advertisement == null) {
        res.redirect(404, `/advertisements/${req.params.id}/edit`);
      } else {
        res.redirect(`/advertisements/${advertisement.id}`);
      }
    });
  },

}
