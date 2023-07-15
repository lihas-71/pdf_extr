const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
  } = require('electron');
  
  const path = require('path');
  
  const fs = require('fs');
  
  function createWindow() {
    const win = new BrowserWindow({
      width: 600,
      height: 400,
      icon: 'uniq-brand-logo.png',
      webPreferences: {
        preload: path.join(app.getAppPath(), 'preload.js')
      }
    })
  
    win.loadFile('index.html')
  }
  
  app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
  
  
  
    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
  
    })
  
  });


  ipcMain.on("chooseFile", (event, arg) => {
    const result = dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{
        name: "Images",
        extensions: ["pdf"]
      }]
    });
  
    result.then(({
      canceled,
      filePaths,
      bookmarks
    }) => {
      event.reply("chosenFile", filePaths[0]);
    });
  });
