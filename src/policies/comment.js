const ApplicationPolicy = require("./application");

module.exports = class CommentPolicy extends ApplicationPolicy {
  //create and destroy have same rules, so no updates for now
}
