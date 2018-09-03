const postQueries = require("../db/queries.posts");

module.exports = {

  create(req, res, next) {
    let newPost = {
      title: req.body.title,
      body: req.body.body,
      topicId: req.params.topicId
    };
    postQueries.addPost(newPost, (err, post) => {
      if(err){
        res.redirect(500, "/posts/new");
      } else {
        res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}`);
      }
    });
  },

  destroy(req, res, next) {
    const topicId = req.params.topicId;
    postQueries.deletePost(req.params.id, (err, deletedRecordsCount) => {
      if(err) {
        res.redirect(500, `/topics/${topicId}/posts/${req.params.id}`)
      } else {
        res.redirect(303, `/topics/${topicId}`)
      }
    });
  },

  edit(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if( err || post == null ) {
        res.redirect(404, "/");
      } else {
        res.render("posts/edit", {post});
      }
    })
  },

  new(req, res, next) {
    res.render("posts/new", {topicId: req.params.topicId});
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
    postQueries.updatePost(req.params.id, req.body, (err, post) => {
      const topicId = req.params.topicId;
      const postId = req.params.id;
      if(err || post == null) {
        res.redirect(404, `/topics/${topicId}/posts/${postId}/edit`);
      } else {
        res.redirect(`/topics/${topicId}/posts/${postId}`);
      }
    })
  },

};
