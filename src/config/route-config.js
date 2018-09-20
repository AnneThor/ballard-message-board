module.exports = {

  init(app) {
      const postRoutes = require("../routes/posts");
      const staticRoutes = require("../routes/static");
      const topicRoutes = require("../routes/topics");
      const userRoutes = require("../routes/users");

      if(process.env.NODE_ENV === "test") {
        const mockAuth = require("../../spec/support/mock-auth");
        mockAuth.fakeIt(app);
      }

      app.use(postRoutes);
      app.use(staticRoutes);
      app.use(topicRoutes);
      app.use(userRoutes);

  }

}
