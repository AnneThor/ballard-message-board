module.exports = {

  init(app) {
      const postRoutes = require("../routes/posts");
      const staticRoutes = require("../routes/static");
      const topicRoutes = require("../routes/topics");
      app.use(postRoutes);
      app.use(staticRoutes);
      app.use(topicRoutes);
  }

}
