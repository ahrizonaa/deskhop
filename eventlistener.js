const { setWallpaper } = require("wallpaper");
const axios = require("axios");
const sharp = require("sharp");

// import { setWallpaper } from "wallpaper";
// import axios from "axios";
// import sharp from "sharp";

const setRandomWallpaper = async () => {
  console.log("Setting wallpaper from unsplash...");
  let unsplashresult = await axios.get(
    "https://api.unsplash.com/photos/random?query=tigers,lions,cheetah,puma,cougar&orientation=landscape&content_filter=low",
    {
      headers: {
        Authorization: "Client-ID v5x2676naGT88sbW4XkTtPmOOEuJIQ1HmqTziTsKA-c",
      },
    }
  );

  let imgurl = unsplashresult.data.urls.full;

  let imgDownloadResponse = await axios.get(imgurl, {
    responseType: "arraybuffer",
  });

  await sharp(imgDownloadResponse.data)
    .resize(2560, 1440)
    .toFile("./sharp.jpg");

  await setWallpaper("./sharp.jpg");
};

module.exports = { setRandomWallpaper };
