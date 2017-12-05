/**
 * @requires electron
 * @requires electron.remote
 * @requires electron.BrowserWindow
 */
const electron = require('electron')
const remote = electron.remote
const BrowserWindow = electron.BrowserWindow

exports.login = (sbc) => {
  let authWindow = new electron.BrowserWindow({
    width: 800, height: 600,
    show: false, alwaysOnTop: true,
    webPreferences: {nodeIntegration: false}
  })

  const showAuthWindowIfNotLoggedIn = () => {
    authWindow.show()
  }

  const unloadAndCloseAuthWindow = () => {
    authWindow.webContents.removeListener('did-finish-load', showAuthWindowIfNotLoggedIn)
    authWindow.destroy()
  }

  const loadAuthUrl = () => {
    authWindow.loadURL('https://stackexchange.com/oauth/dialog?redirect_uri=https://stackexchange.com/oauth/login_success&client_id=10932&scope=write_access  private_info read_inbox')
  }

  authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    const isMainPage = !/[a-zA-Z]+/.test(newUrl.replace(/(https|http)/, '').replace('//stackexchange.com', ''))
    if (isMainPage) {
      return loadAuthUrl()
    }
    const isError = newUrl.indexOf('error') >= 0
    const hasToken = newUrl.indexOf('access_token') >= 0
    if (isError || !hasToken) {
      return
    }
    // Success authentication
    const hashPosition = newUrl.indexOf('#') + 1
    let [token, expires] = newUrl.substring(hashPosition).split('&')

    token = token.split('=')[1]
    expires = expires.split('=')[1]
    sbc(token, expires)
    unloadAndCloseAuthWindow()
  })
  authWindow.webContents.on('did-finish-load', showAuthWindowIfNotLoggedIn)

  authWindow.on('closed', () => {
    authWindow = null
  })
  loadAuthUrl()
}
exports.logout = (params) => {
  let RequestBuilder = remote.getGlobal('RequestBuilder')
  const win = remote.getCurrentWindow()
  const logoutPromise = fetch(RequestBuilder.buildUrl(`/apps/${params['access_token']}/de-authenticate`))
  logoutPromise.then(() => {
    const session = win.webContents.session
    session.cookies.remove('https://stackexchange.com', 'acct', () => {})
    win.reload()
  })
}