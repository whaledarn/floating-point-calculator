const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ /// parsing code
  extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) { // Immediately loads html page

  res.sendFile(__dirname + "/index.html");
})

function isValid(p, q, sig, pbits, qbits){
  if(sig != 0 || sig != 1)
    return false;
  if(pbits.length != p || qbits.length != q)
    return false;
  return true;
}

app.post("/", function(req, res) { // Called when button is pressed
  var p = req.body.p;
  var q = req.body.q;
  var sig = req.body.sig;
  var pbits = req.body.pbits;
  var qbits = req.body.qbits;

  res.write("<div class='row g-4 py-5 row-cols-1 row-cols-lg-3'>" + "penis" +"</div>")

  res.send();
})

app.listen(3000, function() {
  console.log("running on 3000");
})
