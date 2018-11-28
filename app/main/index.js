const {app, BrowserWindow} = require('electron');
const prepareRenderer = require('electron-next');
const path = require('path');
const rootPath = path.join(__dirname, '..', '..');
const isDev = require('electron-is-dev');
if (isDev) {
  require('electron-reload')(rootPath, {
    electron: path.join(rootPath, 'node_modules', '.bin', 'electron')
  });
}

let win;

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});
  const devPath = 'http://localhost:8000/';
  const prodPath = path.join(rootPath, 'app/renderer/out/index.html');
  const entry = isDev ? devPath : 'file://' + prodPath;
  win.loadURL(entry);
  if (isDev) win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', async () => {
  if (isDev) await prepareRenderer('./app/renderer');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
