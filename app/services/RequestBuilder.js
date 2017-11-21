/**
 * @class RequestBuilder
 * @classdesc RequestBuilder - клас для побудови запиту та отримання данних з серверу
 */
class RequestBuilder {
  /**
   * @description Побудова запиту у вигляді рядка для відправки данних на сервер
   * @param {string} url - Url, на який зробити запит
   * @param {Object} parameters - додаткові параметри, особливі для різних запитів
   * @returns {string} - данні у вигляді рядка з параметрами
   */
  static buildUrl (url, parameters) {
    /** stackexchange api url */
    url = `https://api.stackexchange.com/2.2${url}`
    const qString = parameters && Object.keys(parameters).map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`
    }).join('&')
    if (qString) {
      url += `?${qString}`
    }
    return url
  }

  /**
   * Отримання даних з сервера
   * @param {string} url - Url, на який зробити запит
   * @param {Object} parameters - додаткові параметри, особливі для різних запитів
   * @param {Object} [options={}] - не обов`язковий об`єкт з настройками запиту.
   * @returns {Promise} Promise object
   */
  static async fetch (url, parameters, options={}) {
    if (parameters && typeof parameters === 'object') {
      parameters.site = 'ru.stackoverflow.com'
      parameters.key = 'uzt*oDqUgZZsITxGHfU7XA(('
    }
    return await fetch(RequestBuilder.buildUrl(url, parameters), options)
      .then(response => response.json())
  }
}

module.exports = RequestBuilder