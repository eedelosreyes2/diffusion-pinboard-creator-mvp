// const functions = require("firebase-functions");
// const axios = require("axios");
// const cors = require("cors")({origin: true});

const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

exports.scraper = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }

    return axios.get("https://example.com")
      .then(response => {
        console.log(response.data);
        return res.status(200).json({
          message: response.data
        })
      })
      .catch(err => {
        return res.status(500).json({
          error: err
        })
      });
  })
});