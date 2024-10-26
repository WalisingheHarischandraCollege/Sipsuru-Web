import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.loadURL('https://sipsuru.com')

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('launch.php')) {
      openSipsuruMediaPlayer(url)
      return { action: 'deny' } // Prevent default behavior
    }
    return { action: 'allow' } // Allow default behavior for other URLs
  })
}

function openSipsuruMediaPlayer(url) {
  // Extract and print the token
  const tokenPattern = /token=([A-Za-z0-9%+\\/=]+)/
  const match = url.match(tokenPattern)

  if (match && match[1]) {
    const token = decodeURIComponent(match[1])

    const trimmedToken = token.slice(0, -21)

    const constructedTrimmedUrl = `dragon://token/${trimmedToken}`
    //const constructeddUrl = `dragon://token/${token}`

    mainWindow.loadURL(constructedTrimmedUrl)

    //TODO: create the confirmation and if false open non-trimed url
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
