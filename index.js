const { ocrSpace } = require('ocr-space-api-wrapper');
var express = require('express');
const cors = require('cors')
const axios = require('axios');
var bodyParser = require('body-parser')
const encodedParams = new URLSearchParams();
var app = express();
app.use(cors());
app.use(bodyParser.json());

// user variables 
var ocrText 
var sentimentResult
var spotifyResponse

// testing 
app.get('/o', (req, res) => {
  res.send("test")

})

// sentiment 
function sent(ocrText) {

  encodedParams.set('text',ocrText);
  const options = {
    method: 'POST',
    url: 'https://text-sentiment.p.rapidapi.com/analyze',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': 'e97ccb3880mshf3869b1013f75d3p10be04jsnb4ecf09b217d',
      'X-RapidAPI-Host': 'text-sentiment.p.rapidapi.com'
    },
    data: encodedParams,
  };
  

  try {
   sentimentCaller(options)
   
  } catch (error) {
    console.error(error);
  }
  

}


// sentimental code  
async function sentimentCaller(options){
  const response = await axios.request(options);
 sentimentResult= response.data


 }


// ocr analysis  
app.get('/test/:id', (req, res) => {
  //console.log(req.params.id)
  main(req.params.id, res)

})
async function main(url, res) {
  console.log(url)
  try {
    // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
    const res1 = await ocrSpace(url);
   
    ocrText=res1.ParsedResults[0].ParsedText
    //console.log(ocrText)
   
    sent(ocrText)
     
    setTimeout(()=> {
      var sender = [ocrText,sentimentResult]
   
      console.log(sender)
      res.send(sender)
   }
   ,3000);

     
    // Using your personal API key + local file
    // const res2 = await ocrSpace('/path/to/file.pdf', { apiKey: '<API_KEY_HERE>' });

    // Using your personal API key + base64 image + custom language
    // const res3 = await ocrSpace('data:image/png;base64...', { apiKey: '<API_KEY_HERE>', language: 'ita' });
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
  console.log("called")
    fetch('https://musicrecom.onrender.com/')
    .then(response =>console.log(response) )
      
   
}
// binding port 
app.listen(6969, () => console.log('listening on 6969'))


