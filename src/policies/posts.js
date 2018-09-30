const ApplicationPolicy = require("./application");

module.exports = class PostsPolicy extends ApplicationPolicy {

  //deleted new() because it's not changing the parent class

  create() {
    return this.new();
  }

  edit() {
    return this._isAdmin() || this._isOwner();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }

}
