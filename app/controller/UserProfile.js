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
   * @param data {Object} - данні у вигляді об'єкта
   * @return {UserProfile}
   */

  constructor (data = {}) {
    this.id = uniqid()
    this.Age = data['age'] || null
    this.Link = data['link'] || null
    this.Location = data['location'] || null
    this.UserName = data['display_name'] || null
    this.CreateAt = data['creation_date'] || null
    this.UserPicture = data['profile_image'] || null
    this.Badges = new Privileges(data['badges']) || null
    this.Privileges = new Privileges(data['reputation']) || null
  }

  /**
   * @description Досягнення користувача
   * @return {Badges}
   */
  get MyBadges () {
    return this.Badges.badges
  }

  /**
   * @description Репутація користувача
   * @return {Badges}
   */
  get MyPrivileges () {
    return this.Privileges.reputation
  }

  /**
   * @description Асинхронний метод ініціалізації користувача
   */

  static initWithStaticData (profile) {

  }

  async render () {
    const fn = getMe.memoize()
    let profile = await fn()

    this.Age = profile['age']
    this.Link = profile['link']
    this.Location = profile['location']
    this.UserName = profile['display_name']
    this.CreateAt = profile['creation_date']
    this.UserPicture = profile['profile_image']

    this.Badges = new Badges(profile['badge_counts'])
    this.Privileges = new Privileges(profile['reputation'])
  }
}

const getMe = async () => {
  console.log('get me pls Aaaa  mmmm !')
  return await RequestServices.fetch('/me', {access_token: localStorage.token}).then(response => {
    return response.items[0]
  })
}

module.exports = UserProfile