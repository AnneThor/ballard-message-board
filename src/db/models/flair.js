'use strict';
module.exports = (sequelize, DataTypes) => {
  const Flair = sequelize.define('Flair', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Flair.associate = function(models) {
    // associations can be defined here
    Flair.hasMany(models.Topic, {
      foreignKey: "flairId",
      as: "topics"
    });
  };
  return Flair;
};
