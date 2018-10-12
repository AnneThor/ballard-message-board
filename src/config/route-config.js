module.exports = {

  init(app) {

      const commentRoutes = require("../routes/comments");
      const favoriteRoutes = require("../routes/favorites");
      const postRoutes = require("../routes/posts");
      const staticRoutes = require("../routes/static");
      const topicRoutes = require("../routes/topics");
      const userRoutes = require("../routes/users");
      const voteRoutes = require("../routes/votes");

      if(process.env.NODE_ENV === "test") {
        const mockAuth = require("../../spec/support/mock-auth");
        mockAuth.fakeIt(app);
      }

      app.use(commentRoutes);
      app.use(favoriteRoutes);
      app.use(postRoutes);
      app.use(staticRoutes);
      app.use(topicRoutes);
      app.use(userRoutes);
      app.use(voteRoutes);

  }

}
