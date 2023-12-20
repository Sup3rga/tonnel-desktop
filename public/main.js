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
        minHeight = Math.floor(dimension.height * 0.7),
        maxWidth = dimension.width,
        current = {width: minWidth, height: minHeight},
        maxHeight = dimension.height;
   // Create the browser window.
  const win = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    hasShadow: true,
    thickFrame: false,
    show: false,
    // resizable: false,
    webPreferences: {
        preload: path.join(__dirname, "native.js"),
        nodeIntegration: true
    }
  })
  win.on('ready-to-show', ()=>{
    win.show();
  });

  win.loadURL('http://localhost:3000');
  win.setBackgroundColor('#eee');
  win.setOpacity(0);  
  ipcMain.on("resize", (src, {
      width = 800, 
      height = 600, 
      minimal = {width: minWidth, height: minHeight}, 
      maximal = {width: maxWidth, height: maxHeight},
      resizable = false,
      restore = false
  })=>{
     win.setResizable(resizable);
     win.setMinimumSize(minimal.width, minimal.height);
     if(maximal){
       win.setMaximumSize(maximal.width, maximal.height);
     }
     if(restore) console.log('[Restore]',current);
     win.setBounds({
       width: width < minimal.width ? minimal.width : !restore ? width : current.width, 
       height: height < minimal.height ? minimal.height : !restore ? height : current.height
    }, false);
     setTimeout(()=> win.center(), 200);
     src.reply("resize", true);
  });
  ipcMain.on("hide", ()=>{
    win.hide();
  });
  ipcMain.on("save-dimension", ()=>{
    current.width = win.getBounds().width;
    current.height = win.getBounds().height;
  })
  ipcMain.on("show", ()=>{
    win.show();
  });
  ipcMain.on("center", ()=>{
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