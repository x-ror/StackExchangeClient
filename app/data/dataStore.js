class Datastore{
  static set(params){
    if(typeof params == 'object'){
      for (let [k, v] of Object.entries(params)) {
        localStorage.setItem(k, JSON.stringify(v));
      }
    }
  } 
  static get(key){
    if(localStorage.getItem(key) !== 'undefined')
      return JSON.parse(localStorage.getItem(key));
  }
}
export default Datastore;