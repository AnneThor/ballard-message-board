const postQueries = require("../db/queries.posts");
const Authorizer = require("../policies/posts");

module.exports = {

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
      let newPost = {
        title: req.body.title,
        body: req.body.body,
        topicId: req.params.topicId,
        userId: req.user.id,
      };
      postQueries.addPost(newPost, (err, post) => {
        if(err){
          res.redirect(500, "/posts/new");
        } else {
          res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}`);
        }
      });
    } else { //not authorized
      req.flash("notice", "You must be signed in to add new posts!");
      res.redirect(`/posts/${post.id}`);
    }
  },

  destroy(req, res, next) {
    const topicId = req.params.topicId;
    postQueries.deletePost(req, (err, deletedRecordsCount) => {
      if(err) {
        res.redirect(500, `/topics/${topicId}/posts/${req.params.id}`)
      } else {
        res.redirect(303, `/topics/${topicId}/posts`)
      }
    });
  },

  edit(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if (err || post == null) {
        res.redirect(404, `/topics/${req.params.topicId}/posts/${req.params.id}`);
      } else {
        const authorized = new Authorizer(req.user, post).edit();
        if (authorized) {
          res.render("posts/edit", {post});
        } else { //not authorized
          req.flash("notice", "You can only edit posts if you are logged in as the author or if you are logged in as an admin");
          res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
        }
      }
    })
  },

  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if(authorized) {
      res.render("posts/new", {topicId: req.params.topicId});
    } else {
      req.flash("notice", "You must sign in to create new posts");
      res.redirect("/posts");
    }
  },

  show(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if(err || post == null) {
        res.redirect(404, "/");
      } else {
        res.render("posts/show", {post});
      }
    });
  },

  update(req, res, next) {
    postQueries.updatePost(req, req.body, (err, post) => {
      if(err || post == null) {
        res.redirect(404, `/topics/${req.params.topicId}/posts/${req.params.id}/edit`);
      } else {
        res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
      }
    })
  },

};
