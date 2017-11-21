let events = {}

class Observer {
  static subscribe (eventName, object, callback) {
    events[eventName] = events[eventName] || []
    events[eventName].push({object: object, callback: callback})
  }

  static unsubscribe (eventName, object) {
    if (events[eventName]) {
      for (let i = 0; i < events[eventName].length; i++) {
        if (events[eventName][i].object === object) {
          events[eventName].splice(i, 1)
          break
        }
      }
    }
  }

  static publish (eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function (instance) {
        instance.callback(data)
      })
    }
  }
}

module.exports = Observer