class Privileges {
  constructor (user) {
    this.reputation = user.reputation
  }

  myPrivileges () {
    return this.reputation
  }
}
module.exports = Privileges