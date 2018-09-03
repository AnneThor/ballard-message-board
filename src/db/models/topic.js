'use strict';
module.exports = (sequelize, DataTypes) => {
  var Topic = sequelize.define('Topic', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flairId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {});
  Topic.associate = function(models) {
    // associations can be defined here
    Topic.hasMany(models.Banner, {
      foreignKey: "topicId",
      as: "banners",
    });
    Topic.hasMany(models.Post, {
      foreignKey: "topicId",
      as: "posts"
    });
    Topic.belongsTo(models.Flair, {
      foreignKey: "flairId",
      onDelete: "SET NULL",
    });
  };
  return Topic;
};
