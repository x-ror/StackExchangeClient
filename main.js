const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow;

const path = require('path')
const url = require('url')

let mainWindow
let windowOptions = {
  width: 1080,
  minWidth: 680,
  height: 840,
  // frame: false,
  title: 'Stack Overflow'
};
function createWindow () {
  mainWindow = new BrowserWindow(windowOptions)

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
