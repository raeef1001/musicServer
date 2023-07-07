// imports
const { ocrSpace } = require("ocr-space-api-wrapper");
var express = require("express");
const cors = require("cors");
const axios = require("axios");
var bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();
// basic setups
const encodedParams = new URLSearchParams();
var app = express();
app.use(cors());
app.use(bodyParser.json());
// user variables
var ocrText;
var sentimentResult;
var spotifyResponse;
var spotkey = "BQD3cPo8bOcuVHMbMKupYDDNmGI-dsAKbbdPfmNzQKFnQwKG91dZp13Lk90NV_UM7Raajx0uGTG-HntZlKp4VTF0WWZ0VRICnWcx-41jK91kiKrsdvs";
// testing
app.get("/o", (req, res) => {
  res.send("test");
});
app.get("/spotkey", (req, res) => {
  res.send(spotkey);
});
// sentiment
function sent(ocrText) {
  encodedParams.set("text", ocrText);
  const options = {
    method: "POST",
    url: "https://text-sentiment.p.rapidapi.com/analyze",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": `${process.env.RAPID_API_KEY}`,
      "X-RapidAPI-Host": "text-sentiment.p.rapidapi.com",
    },
    data: encodedParams,
  };
  try {
    sentimentCaller(options);
  } catch (error) {
    console.error(error);
  }
}
// sentimental code
async function sentimentCaller(options) {
  const response = await axios.request(options);
  sentimentResult = response.data;
}
// ocr analysis
app.get("/test/:id", (req, res) => {
  //console.log(req.params.id)
  main(req.params.id, res);
});
async function main(url, res) {
  console.log(url);
  try {
    // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
    const res1 = await ocrSpace(url);
    ocrText = res1.ParsedResults[0].ParsedText;
    //console.log(ocrText)
    sent(ocrText);
    setTimeout(() => {
      var sender = [ocrText, sentimentResult];
      console.log(sender);
      res.send(sender);
    }, 3000);
  } catch (error) {
    console.error(error);
  }
}
// always running
let intervalID;
function repeatEverySecond() {
  intervalID = setInterval(sendMessage, 100000);
}
function sendMessage() {
  console.log("called");
  fetch("https://musicrecom.onrender.com/o").then((response) =>
    console.log(response)
  );
}

// spotify auth token maker 
let spotifyID;
function repeatEveryhour() {
  spotifyID = setInterval(spotify, 1000*60*30);
}
async function spotify() {
  console.log("called spotify");
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': `${process.env.CLIENT_ID}`,
      'client_secret': `${process.env.CLIENT_SECRET}`
    })
  );
  console.log(response.data.access_token)
  spotkey = response.data.access_token
}


repeatEverySecond()
repeatEveryhour()
// binding port
app.listen(6969, () => console.log("listening on 6969" + process.env.TEST));
