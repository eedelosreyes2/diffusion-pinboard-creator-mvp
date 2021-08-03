const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const fs = require("fs");

exports.scraper = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "POST") {
      const url = req.body.url;
      return axios.get(url)
        .then(response => {
          const html = response.data;
          const $ = cheerio.load(html);

          const getMetatag = (name) => {
            $(`meta[name=${name}]`).attr("content") ||  
            $(`meta[property="og:${name}"]`).attr("content") ||  
            $(`meta[property="twitter:${name}"]`).attr("content");
          };

          const getScreenshot = async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url, {"waitUntil" : "networkidle0"});
            await page.screenshot({
              path: "/tmp/imagebase64.png",
              omitBackground: true
            });
            await browser.close();
          };

          getScreenshot().then(() => {
            const imagebase64 = fs.readFileSync("/tmp/imagebase64.png", {encoding:"base64"});
  
            const data = {
              url,
              metaTitle: $("title").first().text(),
              metaFavicon: $("link[rel='shortcut icon']").attr("href"),
              metaDescription: $("meta[name=description]").attr("content"),
              metaDescription: getMetatag("description"),
              metaImage: getMetatag("image"),
              metaImagebase64: imagebase64,
              metaAuthor: getMetatag("author"),
            };
  
            return res.status(200).send(data);
          });
        })
        .catch((err) => {
          return res.status(500).json({
            error: err
          });
        });
    }
    else if (req.method === "GET") {
      res.send("This is a GET request.");
    }
  })
});
