module.exports = {

  init(app) {
      const flairRoutes = require("../routes/flairs");
      const postRoutes = require("../routes/posts");
      const staticRoutes = require("../routes/static");
      const topicRoutes = require("../routes/topics");
      const userRoutes = require("../routes/users");

      app.use(flairRoutes);
      app.use(postRoutes);
      app.use(staticRoutes);
      app.use(topicRoutes);
      app.use(userRoutes);
  }

}
