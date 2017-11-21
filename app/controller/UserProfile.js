/**
 * @requires RequestServices
 * @requires Privileges
 * @requires Badges
 * @requires uniqid
 */
const RequestServices = require('../services/RequestBuilder')
const Privileges = require('./Privileges')
const Badges = require('./Badges')
const uniqid = require('uniqid')

/**
 * @class UserProfile
 * @classdesc UserProfile - клас для роботи з данними користувача
 */
class UserProfile {
  /**
   * @constructor
   * @description створює об'єкт класу UserProfile
   */
  constructor () {
    this.profile = {}
  }

  /**
   * @description Досягнення користувача
   * @return {Badges}
   */
  get MyBadges () {
    return this.Badges.MyBadges()
  }

  /**
   * @description Репутація користувача
   * @return {Badges}
   */
  get MyPrivileges () {
    return this.Privileges.myPrivileges()
  }

  /**
   * @description Асинхронний метод ініціалізації користувача
   */
  async render () {
    this.id = uniqid()
    this.profile = await getMe()
    this.Badges = new Badges(this.profile)
    this.Privileges = new Privileges(this.profile)
  }
}

const getMe = async () => {
  return await RequestServices.fetch('/me', {access_token: localStorage.token}).then(response => {
    return response.items[0]
  })
}

module.exports = UserProfile