const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow;

const path = require('path')
const url = require('url')

let mainWindow
let windowOptions = {
  width: 1080,
  height: 840,
  minWidth: 680,
  title: 'Stack Overflow'
  // frame: false,
};
const createWindow = () => {
  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
};

app.on('ready', createWindow);
app.on('window-all-closed',  () => {
  if (process.platform !== 'darwin') {
    app.quit();
  };
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  };
});
