const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const user = require('./app/controller/UserController');
const RequestServices = require('./app/services/RequestServices').request();
const UserProfile = require('./app/controller/UserProfile')._();
const win = remote.getCurrentWindow();
let profile;
ipc.on('sidebar:initialize',(event)=>{
    let profile = new UserProfile().render();
});

ipc.on('stackexchange:login', (event, data) => {
    localStorage.token = data.token;
    Object.freeze(localStorage.token);
    win.webContents.send('sidebar:initialize');
});