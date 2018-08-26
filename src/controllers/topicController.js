const topicQueries = require("../db/queries.topics.js");

module.exports = {

  create(req, res, next) {
    let newTopic = {
      title: req.body.title,
      description: req.body.description
    };
    topicQueries.addTopic(newTopic, (err, topic) => {
      if (err) {
        res.redirect(500, "/topics/new");
      } else {
        res.redirect(303, `/topics/${topic.id}`);
      }
    });
  },

  destroy(req, res, next) {
    topicQueries.deleteTopic(req.params.id, (err, topic) => {
      if (err) {
        res.redirect(500, `/topics/${topic.id}`);
      } else {
        res.redirect(303, "/topics");
      }
    })
  },

  edit(req, res, next) {
    topicQueries.getTopic(req.params.id, (err, topic) => {
      if (err || topic == null) {
        res.redirect(404, "/");
      } else {
        res.render("topics/edit", {topic});
      }
    })
  },

  index(req, res, next) {
    topicQueries.getAllTopics( (err, topics) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("topics/index", {topics});
      }
    })
  },

  new(req, res, next) {
    res.render("topics/new");
  },

  show(req, res, next) {
    topicQueries.getTopic(req.params.id, (err, topic) => {
      if(err || topic == null) {
        res.redirect(404, "/");
      } else {
        res.render("topics/show", {topic});
      }
    });
  },

  update(req, res, next) {
    topicQueries.updateTopic(req.params.id, req.body, (err, topic) => {
      if (err || topic == null) {
        res.redirect(404, `/topics/${req.params.id}/edit`);
      } else {
        res.redirect(`/topics/${topic.id}`);
      }
    });
  },

}
