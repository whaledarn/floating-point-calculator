const express = require("express");
const bodyParser = require("body-parser");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();

app.use(bodyParser.urlencoded({ /// parsing code
  extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) { // Immediately loads html page

  res.sendFile(__dirname + "/index.html");
})
global.document = new JSDOM("/index.html").window.document;


function isValid(p, q, sig, pbits, qbits){
  if(sig != 0 || sig != 1)
    return false;
  if(pbits.length != p || qbits.length != q)
    return false;
  return true;
}



function isDenormalized(pbits,qbits){
  for(var i = 0; i<pbits.length; i++){
    if(pbits[i]=='1')
      return false;
  }
}

function isInfinity(pbits, qbits){
  for(var i = 0; i<pbits.length; i++){
    if(pbits[i]=='0')
      return false;
  }
  for(var i = 0; i<qbits.length; i++){
    if(qbits[i]=='1')
      return false;
  }
  return true;
}

function isNaN(pbits, qbits){
  for(var i = 0; i<pbits.length; i++){
    if(pbits[i]=='0')
      return false;
  }
  for(var i = 0; i<qbits.length; i++){
    if(qbits[i]=='1')
      return true;
  }
  return false;
}

function calculateNormalized(s,p,b){

}

function calculateDenormalized(s,p,b){

}

app.post("/", function(req, res) { // Called when button is pressed
  var sig = req.body.s;
  var pbits = req.body.p;
  var qbits = req.body.q;

  console.log(typeof(pbits));

  if(isInfinity(pbits,qbits))
    console.log("Is infinity");
  else if(isNaN(pbits,qbits))
    console.log("Is NaN");
  else if(isDenormalized(pbits,qbits))
    console.log("Is denormalized");
    else
      console.log("Is normalized");


  document.getElementById("answer").style.display = "inline";
  // res.write("<div class='row g-4 py-5 row-cols-1 row-cols-lg-3'>" + "penis" +"</div>")

  res.sendFile(__dirname + "/index.html");
})

app.listen(3000, function() {
  console.log("running on 3000");
})
