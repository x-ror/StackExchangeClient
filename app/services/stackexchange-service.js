const win = require('electron').remote.getCurrentWindow();
exports.fetch = (url,parameters,options) => {
  if(parameters){
    parameters.site = 'ru.stackoverflow.com';
    parameters.key =  'uzt*oDqUgZZsITxGHfU7XA((';
  }
  return fetch(exports.buildUri(url,parameters),options).then(response => response.json());
}

exports.buildUri = (url,parameters) => {
  url = `https://api.stackexchange.com/2.2${url}`;
  let qString = parameters && Object.keys(parameters).map((key)=>{
    return `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`;
  }).join('&');
  if(qString){
    url += `?${qString}`;
  }
  return url;
}

exports.logOut = (params) => {
  const logoutPromise = fetch(exports.buildUri(`/apps/${params.access_token}/de-authenticate`));
  logoutPromise.then(() => {
    const session = win.webContents.session;
    session.cookies.remove('https://stackexchange.com', 'acct', ()=>{});
    win.reload();
  });
}