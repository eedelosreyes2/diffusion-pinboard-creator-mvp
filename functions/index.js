const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });
const cheerio = require("cheerio");

exports.scraper = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "POST") {
      return axios.get(req.body.url)
        .then(response => {
          const html = response.data;
          const $ = cheerio.load(html);

          const getMetatag = (name) => {
            $(`meta[name=${name}]`).attr("content") ||  
            $(`meta[property="og:${name}"]`).attr("content") ||  
            $(`meta[property="twitter:${name}"]`).attr("content");
          };

          const data = {
            url: req.body.url,
            title: $("title").first().text(),
            favicon: $("link[rel='shortcut icon']").attr("href"),
            description: $("meta[name=description]").attr("content"),
            description: getMetatag("description"),
            image: getMetatag("image"),
            author: getMetatag("author"),
          };

          return res.status(200).send(data);
        })
        .catch(err => {
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

// const scrapeMetatags = (url) => {
//   const res = await fetch(url);

//   const html = await res.text();
//   const $ = cheerio.load(html);

//   const getMetatag = (name) =>  
//     $(`meta[name=${name}]`).attr("content") ||  
//     $(`meta[property="og:${name}"]`).attr("content") ||  
//     $(`meta[property="twitter:${name}"]`).attr("content");

//   return { 
//     url,
//     title: $("title").first().text(),
//     favicon: $("link[rel='shortcut icon']").attr("href"),
//     // description: $("meta[name=description]").attr("content"),
//     description: getMetatag("description"),
//     image: getMetatag("image"),
//     author: getMetatag("author"),
//   }
// };