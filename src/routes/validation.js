module.exports = {
  validatePosts(req, res, next) {
    if(req.method === "POST") {
      req.checkParams("topicId", "must be valid").notEmpty().isInt();
      req.checkBody("title", "must be at least 2 characters").isLength({min: 2});
      req.checkBody("body", "must be at least 10 characters").isLength({min: 10});
    }
    const errors = req.validationErrors();
    if(errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer)
    } else {
      return next();
    }
  },

  validateUsers(req, res, next) {
    if(req.method === "POST") {
      req.checkBody("email", "must be valid").isEmail();
      req.checkBody("password", "must be at least 6 characters").isLength({min: 6});
      req.checkBody("passwordConfirmation", "must match password").optional().matches(req.body.password);
    }
    const errors = req.validationErrors();
    if(errors) {
      console.log(currentUser.id, currentUser);
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  },

}