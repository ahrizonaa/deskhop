const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const sharp = require("sharp");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);

let executionResult = {};

var setRandomWallpaper = async (tags) => {
  let unsplashresult = await axios.get(
    `https://api.unsplash.com/photos/random?query=${tags.join(
      ","
    )}&orientation=landscape&content_filter=low`,
    {
      headers: {
        Authorization: "Client-ID v5x2676naGT88sbW4XkTtPmOOEuJIQ1HmqTziTsKA-c",
      },
    }
  );

  executionResult.unsplash = unsplashresult.data.urls;

  let imgurl = unsplashresult.data.urls.full;

  let axiosGetResponse = await axios.get(imgurl, {
    responseType: "arraybuffer",
  });

  await sharp(axiosGetResponse.data)
    .resize(2560, 1440)
    .toFile(process.resourcesPath, "app", " sharp.jpg");

  let exe = path.join(process.resourcesPath, "app", "Deskhop.net.exe");
  let img = path
    .join(process.resourcesPath, "app", "sharp.jpg")
    .replace("/", "\\");

  executionResult.files = { exe, img };

  return await execFile(exe, [img]);
};

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("set-wallpaper", async (event, tags) => {
    try {
      let execResult = await setRandomWallpaper(tags);
      executionResult.execFile = execResult;
    } catch (exc) {
      executionResult.exception = exc;
    } finally {
      executionResult.success =
        !executionResult.execFile.stderr &&
        !executionResult.unsplash.errors &&
        !executionResult.exception;
      return executionResult;
    }
  });

  mainWindow.loadFile("./dist/deskhop/index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
