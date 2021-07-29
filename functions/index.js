const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
// const cors = require("cors")({origin: true});

exports.scraper = functions.https.onRequest((request, response) => {
  response.send("Scraper!");
});

// const cheerio = require("cheerio");
// const getUrls = require("get-urls");
// const fetch = require("node-fetch");
// const puppeteer = require("puppeteer");

// const scrapeMetatags = (text) => {
//   const urls = Array.from( getUrls(text) );
//   const requests = urls.map(async (url) => {
//     const res = await fetch(url);
//     const html = await res.text();
//     const $ = cheerio.load(html);
//     const getMetatag = (name) =>
//       $(`meta[name=${name}]`).attr("content") ||
//       $(`meta[property="og:${name}"]`).attr("content") ||
//       $(`meta[property="twitter:${name}"]`).attr("content");

//     return {
//       url,
//       title: $("title").first().text(),
//       favicon: $("link[rel='shortcut icon']").attr("href"),
//       // description: $("meta[name=description]").attr("content"),
//       description: getMetatag("description"),
//       image: getMetatag("image"),
//       author: getMetatag("author"),
//     }});

//     return Promise.all(requests);
// }

// const scrapeImages = async (username) => {
//   const browser = await puppeteer.launch({headless: true});
//   const page = await browser.newPage();

//   await page.goto("https://www.instagram.com/accounts/login/");

//   // Login form
//   await page.screenshot({path: "1.png"});
//   await page.type("[name=username]", "fireship_dev");
//   await page.type("[name=password]", "some-password");
//   await page.screenshot({path: "2.png"});
//   await page.click("[type=submit]");

//   // Social Page
//   await page.waitForTimeout(5000);
//   await page.goto(`https://www.instagram.com/${username}`);
//   await page.waitForSelector("img ", {
//     visible: true,
//   });
//   await page.screenshot({path: "3.png"});

//   // Execute code in the DOM
//   const data = await page.evaluate( () => {
//     const images = document.querySelectorAll("img");
//     const urls = Array.from(images).map((v) => v.src);
//     return urls;
//   });

//   await browser.close();
//   console.log(data);

//   return data;
// };

// exports.scraper = functions.https.onRequest((request, response) => {
//   cors(request, response, async () => {
//     const body = JSON.parse(request.body);
//     // const data = await scrapeMetatags(body.text);
//     // const data = await scrapeImages(body.text);
//     // response.send(data);
//     console.log(body);
//   });
// });
