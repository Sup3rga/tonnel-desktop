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
  const {screen} = require('electron');
  const dimension = screen.getPrimaryDisplay().workAreaSize;
  const minWidth = Math.floor(dimension.width * 0.7),
        minHeight = Math.floor(dimension.height * 0.7);
   // Create the browser window.
  const win = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    hasShadow: true,
    // resizable: false,
    webPreferences: {
        preload: path.join(__dirname, "native.js"),
        nodeIntegration: true
    }
  })
  
  win.loadURL('http://localhost:3000');
  win.setBackgroundColor('rgba(0,0,0,0.5)');
  win.setOpacity(0);  
  ipcMain.on("resize", (src, {width = 800, height = 600, resizable = false})=>{
     win.setResizable(resizable);
     win.setMinimumSize(minWidth, minHeight);
     win.setBounds({
       width: minWidth, 
       height: minHeight
    }, false);
     win.center();
  });
  ipcMain.on('background-change', (src, background)=>{
    win.setBackgroundColor(background);
  });
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