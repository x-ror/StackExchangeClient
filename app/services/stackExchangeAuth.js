const {BrowserWindow} = require('electron').remote
import db from '../data/dataStore';

let authWindow = new BrowserWindow({
  width: 800, height: 600, show: false, alwaysOnTop: true,
  webPreferences: { nodeIntegration: false }
});

const showAuthWindowIfNotLoggedIn = () => {
  authWindow.show();
};

const unloadAndCloseAuthWindow = () => {
  authWindow.webContents.removeListener('did-finish-load', showAuthWindowIfNotLoggedIn);
  authWindow.destroy();
};

const loadAuthUrl = () =>{
  authWindow.loadURL('https://stackexchange.com/oauth/dialog?redirect_uri=https://stackexchange.com/oauth/login_success&client_id=10932&scope=write_access private_info read_inbox');
};

authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
  var isMainPage = !/[a-zA-Z]+/.test(newUrl.replace(/(https|http)/, '').replace('//stackexchange.com', ''));
  if (isMainPage) {
    return loadAuthUrl();
  }
  const isError = newUrl.indexOf('error') >= 0;
  const hasToken = newUrl.indexOf('access_token') >= 0;
  if (isError || !hasToken) {
    return;
  }
  // Success authentication
  const hashPosition = newUrl.indexOf('#') + 1;
  let [token, expires] = newUrl.substring(hashPosition).split('&');
  
  token = token.split('=')[1];
  expires = expires.split('=')[1];

  db.set({access_token: token, expires: expires});
  unloadAndCloseAuthWindow();
});
authWindow.webContents.on('did-finish-load', showAuthWindowIfNotLoggedIn);

authWindow.on('closed', () => {
  authWindow = null;
});

class Auth{
  static login(){
    loadAuthUrl();
  };
  static logout(){
    return null;
  }  
}
export default Auth;