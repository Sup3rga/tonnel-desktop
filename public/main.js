const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron');
// const { fetchLibrary } = require('./native');
const path = require("path");

let menu = new Menu(),
    windows = {
        active: null,
        home: null,
        settings: null
    };

menu.append(new MenuItem({
    label: 'A propos',
    submenu: [{
        label: 'Aide',
        accelerator: 'Ctrl+H',
        click: function(i,win){
            win.toggleDevTools();
        }
    }]
}))

Menu.setApplicationMenu(menu);

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 300,
    height: 400,
    minWidth: 400,
    frame: false,
    hasShadow: true,
    // resizable: false,
    webPreferences: {
        preload: path.join(__dirname, "native.js"),
        nodeIntegration: true
    }
  })
  
  win.loadURL('http://localhost:3000');
  ipcMain.on("resize", (src, {width = 800, height = 500, resizable = false})=>{
     win.setResizable(resizable);
     win.setBounds({width, height}, false);
     win.center();
  })
  ipcMain.on("win-action", (src, action)=>{
      console.log('[acting]', action);
      if(action == 0){
          win.close();
      }
      else if(action == 1){
          win.minimize();
      }
      else if(action == 2){
          win.maximize();
      }
      else if(action == 3){
          win.unmaximize();
      }
  })
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// ipcMain.on("library", fetchLibrary);