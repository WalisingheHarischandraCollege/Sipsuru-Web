import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

window.addEventListener('DOMContentLoaded', () => {
  // Remove the navigation bar
  // const navbar = document.querySelector('nav.fixed-top.navbar')
  // if (navbar) {
  //   navbar.remove()
  // }

  //Remove navBar ul
  // const navUl = document.querySelector('ul.nav.navbar-nav.ml-auto')
  // if (navUl) {
  //   navUl.remove()
  // }

  // Remove the div with id "page-header"
  // const pageHeader = document.getElementById('page-header')
  // if (pageHeader) {
  //   pageHeader.remove()
  // }

  //Remove Footer
  const footer = document.getElementById('page-footer')
  if (footer) {
    footer.remove()
  }

  //Remove nav-drawer
  // const navDrawer = document.getElementById('nav-drawer')
  // if (navDrawer) {
  //   navDrawer.remove()
  // }
})
