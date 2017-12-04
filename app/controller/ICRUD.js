/**
 * Created by Anzhelika on 03.12.2017.
 */
class ICRUD {
  constructor () {
    if (new.target === ICRUD) {
      throw new TypeError('Cannot construct Abstract instances directly')
    }
    if (this.Create === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError('Must override method')
    }
    if (this.Edit === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError('Must override method')
    }
    if (this.Delete === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError('Must override method')
    }
  }
}

module.exports = ICRUD