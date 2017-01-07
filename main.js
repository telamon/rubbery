const {app, BrowserWindow,Menu} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
Menu.setApplicationMenu(null); // disable menu
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname,'static', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const {ipcMain} = require('electron');
const {firewall} = require('../rubberglove/lib/rubberglove.js');
const repo= {
  nav:{
    selected: 'Home',
    loader:0
  },
  firewall:{
    rules:[],
    tick:1
  }
};

function sendState(event,key){
  event.sender.send(`repo.${key}`,repo[key]);
}
const api = {
  'nav.select': (event,arg)=>{
    console.log('nav.select',arg);
    api['nav.setLoader'](event,true);
    if(arg==='firewall' && !repo.firewall.rules.length) {
      api['firewall.getRules'](event,null)
    }else{
      sendState(event,'firewall');
    };
    repo.nav.selected = arg;
    api['nav.setLoader'](event,false);
  },
  'firewall.getRules': (event,arg)=>{
    api['nav.setLoader'](event,true);
    firewall.getRules()
    .then((rules)=>{
      Object.assign(repo.firewall, {rules:rules,tick: new Date()})
      api['nav.setLoader'](event,false);
      sendState(event,'firewall');
    })
  },
  'nav.setLoader':(event,arg)=>{
    repo.nav.loader= repo.nav.loader + (arg ? 1 : -1);
    sendState(event,'nav');
  }
}

Object.keys(api).forEach((action)=>ipcMain.on(action,api[action]));

