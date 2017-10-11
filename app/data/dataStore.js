class Datastore{
  static set(params){
    if(typeof params == 'object'){
      for (let [k, v] of Object.entries(params)) {
        localStorage.setItem(k, v);
      }
    }
  } 
  static get(key){
    if(localStorage.getItem(key) !== 'undefined')
      return localStorage.getItem(key);
  }
}
export default Datastore;