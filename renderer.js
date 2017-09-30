window.$ = window.jQuery = require('jquery');
global.Tether = require('tether');
global.Bootstrap = require('bootstrap');
const stackexchange = require("./src/javascript/stackexchange-auth");

$(()=>{
 $("#login-button").on('click', (e)=>{
  e.preventDefault();
  console.log(stackexchange);
  stackexchange.auth();
 });
});

// console.log(auth({ token: token, expires: expires }));

// const {BrowserWindow} = require('electron').remote
// const win = new BrowserWindow({
//   width: 800,
//   height: 600,
//   alwaysOnTop: true,
//   webPreferences: {
//     nodeIntegration: false
//   }
// });

// win.loadURL('https://stackexchange.com/oauth/dialog?redirect_uri=https://stackexchange.com/oauth/login_success&client_id=10932&scope=write_access private_info read_inbox')

// authWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
//   if (frameName === 'modal') {
//     // open window as modal
//     event.preventDefault()
//     Object.assign(options, {
//       modal: true,
//       parent: mainWindow,
//       width: 100,
//       height: 100
//     })
//     event.newGuest = new BrowserWindow(options)
//   }
// })

// const loadAuthUrl = () => {
//   authWindow.loadURL('https://stackexchange.com/oauth/dialog?redirect_uri=https://stackexchange.com/oauth/login_success&client_id=10932&scope=write_access private_info read_inbox');
// };

// loadAuthUrl();

// // Extract `did-finish-load` handler to own function so we can unbind it later
// const showAuthWindowIfNotLoggedIn = () => {
//   authWindow.show();
// };

// const unloadAndCloseAuthWindow = () => {
//   authWindow.webContents.removeListener('did-finish-load', showAuthWindowIfNotLoggedIn);
//   authWindow.destroy();
// };

// authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
//   var isMainPage = !/[a-zA-Z]+/.test(newUrl.replace(/(https|http)/, '').replace('//stackexchange.com', ''));

//   if (isMainPage) {
//     return loadAuthUrl();
//   }

//   const isError = newUrl.indexOf('error') >= 0;
//   const hasToken = newUrl.indexOf('access_token') >= 0;

//   if (isError || !hasToken) {
//     return;
//   }

//   // Success authentication
//   const hashPosition = newUrl.indexOf('#') + 1;
//   let [token, expires] = newUrl.substring(hashPosition).split('&');
//   token = token.split('=')[1];
//   expires = expires.split('=')[1];
  
//   scb(token, expires);

//   unloadAndCloseAuthWindow();
// });

// // This event can be unregistered by `did-get-redirect-request` handler
// authWindow.webContents.on('did-finish-load', showAuthWindowIfNotLoggedIn);

// authWindow.on('closed', () => {
//   authWindow = null;
// });