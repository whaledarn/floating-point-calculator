const express = require("express");
const bodyParser = require("body-parser");
const alert = require('alert');


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



function isDenormalized(pbits,qbits){
  for(var i = 0; i<pbits.length; i++){
    if(pbits[i]=='1')
      return false;
  }
  return true;
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



function bits2dec(b){
  var value = 0;
  for(var i = b.length-1; i>=0; i--){
    if(b[i] == '1'){
      value += Math.pow(2,b.length-1-i);
    }
  }
  return value;
}

function calculateDenormalized(s, pbits, qbits){
  var num = bits2dec(qbits);
  var denom = Math.pow(2,qbits.length);
  var frac = num/denom;
  var bias = Math.pow(2,pbits.length-1)-1;
  var e = Math.pow(2,1-bias);
  if(s == '1')
    return e*-frac;
  else
    return e*frac;
}

function calculateNormalized(s,pbits,qbits){
  var bias = Math.pow(2,pbits.length-1)-1;
  var exp = bits2dec(pbits);
  var e = Math.pow(2,exp-bias);

  var num = bits2dec(qbits);
  var denom = Math.pow(2,qbits.length);
  var frac = 1+num/denom;

  if(s == '1')
    return e*-frac;
  else
    return e*frac;
}


function getMaxMin(pbits,qbits,s){
  var minQ = "";
  var minP = "";
  for(var i = 0; i<pbits.length-1; i++){
    minP += '1';
  }
  minP+= '0';
  for(var i = 0; i<qbits.length; i++){
    minQ+='1';
  }
  return calculateNormalized(s,minP,minQ);
}


app.post("/", function(req, res) { // Called when button is pressed
  var sig = req.body.s;
  var pbits = req.body.p;
  var qbits = req.body.q;

  var type = "";
  var ans = "";

  console.log(sig);
  console.log(pbits);
  console.log(qbits);

  if(isInfinity(pbits,qbits)){
    type = "an infinity";
    if(sig == '1')
      ans = "-∞";
    else
      ans = "∞";
  }
  else if(isNaN(pbits,qbits)){
    type = "a NaN";
    ans = "NaN";
  }
  else if(isDenormalized(pbits,qbits))
  {
    type = "a denormalized number";
    var num = calculateDenormalized(sig,pbits,qbits);
    ans = num.toString();
  }
  else
  {
    type = "a normalized number";
    var num = calculateNormalized(sig,pbits,qbits);
    ans = num.toString();
  }

  res.send('<!DOCTYPE html><html lang="en" dir="ltr">  <head>    <meta charset="utf-8">    <title>Floating Point Calculator</title>    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"><link rel="stylesheet" href="/success.css">  </head>  <body class="text-center vsc-initialized" data-new-gr-c-s-check-loaded="14.1062.0" data-gr-ext-installed="">      <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">    <header class="masthead mb-auto">    </header>    <main role="main" class="inner cover">      <h1 class="cover-heading">Your float was ' + type +'. </h1>      <h3 class="cover-heading">The value was ' + ans +'. </h3> <p class="lead">With the bits given, the max you get can is ' + getMaxMin(pbits,qbits,"0") + ' and the min you can get is ' + getMaxMin(pbits,qbits,"1")+ '.</p>      <p class="lead">        <form action="/failure" method="post">        <button href="#" class="w-100 btn btn-lg btn-primary">Calculate another!</button>        </form>      </p>    </main>    <footer class="mastfoot mt-auto">      <div class="inner">        <p>Made by <a href="https://www.linkedin.com/in/samuel-wang-512948185/">Sam Wang</a>.</p>      </div>    </footer>  </div>  </body></html>')
  // res.sendFile(__dirname + "/success.html");
})

app.post("/failure", function(req,res){
  console.log("penis");
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("running on 3000");
})
