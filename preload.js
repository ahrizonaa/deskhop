const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setWallpaper: async (tags) => {
    return await ipcRenderer.invoke("set-wallpaper", tags);
  },
});
