const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1290,
    height: 800,
    titleBarStyle: "visible",
    autoHideMenuBar: true,
    minWidth: 1280,
    minHeight: 550,
    webPreferences: {
      devTools: false,
      webSecurity: false
  },
    icon: __dirname + '/img/favicon.png'
  })

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
})


