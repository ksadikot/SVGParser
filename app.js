'use strict'

// C library API
const ffi = require('ffi-napi');

// Express App (Routes)
const express = require("express");
const app     = express();
const path    = require("path");
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(express.static(path.join(__dirname+'/uploads')));

// Minimization
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];

// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});

//Respond to POST requests that upload files to uploads/ directory
app.post('/upload', function(req, res) {
  if(!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  let uploadFile = req.files.uploadFile;
  console.log(uploadFile.name);
 
  // Use the mv() method to place the file somewhere on your server
  uploadFile.mv('uploads/' + uploadFile.name, function(err) {
    if(err) {
      return res.status(500).send(err);
    }

    res.redirect('/');

  });
});

//Respond to GET requests for files in the uploads/ directory
app.get('/uploads/:name', function(req , res){
  fs.stat('uploads/' + req.params.name, function(err, stat) {
    if(err == null) {
      res.sendFile(path.join(__dirname+'/uploads/' + req.params.name));
    } else {
      console.log('Error in file downloading route: '+err);
      res.send('');
    }
  });
});

//******************** Your code goes here ******************** 

let sharedLib = ffi.Library('./libsvgparse', {
  'SVGtoJSON' : ['string', ['string']],
  'getDesc' : ['string', ['string']],
  'circListToJSON' : ['string', ['string']],
  'rectListToJSON' : ['string', ['string']],
  'pathListToJSON' : ['string', ['string']],
  'groupListToJSON' : ['string', ['string']],
  'validate' : ['bool', ['string']],
  'createEmptySVG' : ['bool', ['string']],
  'editTitle' : ['bool', ['string', 'string']],
  'editDesc' : ['bool', ['string', 'string']]
});

//Sample endpoint
app.get('/someendpoint', function(req , res){
  let retStr = req.query.name1 + " " + req.query.name2;
  res.send({
    foo: retStr
  });
});

app.get('/editTitle', function(req, res){
  
  sharedLib.editTitle(req.query.newTitle,"./uploads/"+req.query.fileName);
  let desc = sharedLib.getDesc("./uploads/"+req.query.fileName);

  res.send({
    title: desc
  });

})

app.get('/editDesc', function(req, res){
  
  sharedLib.editDesc(req.query.newDesc,"./uploads/"+req.query.fileName);
  let desc = sharedLib.getDesc("./uploads/"+req.query.fileName);

  res.send({
    title: desc
  });

})

app.get('/createSVG', function(req, res){
  let n = req.query.fileName;
  let fileList = fs.readdirSync('uploads/');

  for (let i = 0; i < fileList.length; i++) {
    if (n == fileList[i]) {
      res.status(800).send("file  already exists");
    }
  }

  if(!(sharedLib.createEmptySVG("./uploads/"+n))){
    res.status(700).send("could not create file");
  }

  res.redirect('/');


});


app.get('/selectSVG', function(req , res){

  let fileList = fs.readdirSync('uploads/');
  let validList = [];

  for (let i = 0; i < fileList.length; i++) {
    if (sharedLib.validate("./uploads/"+fileList[i])) {
      validList.push(fileList[i]);
    }
  }


  res.send({
    fileNames: validList
  });
});

app.get('/allFiles', function(req, res) {

  let fileList = fs.readdirSync('uploads/');
  let JSONList = [];
  let fileSizeArr = [];
  
  for (let i = 0; i < fileList.length; i++) {
    if (sharedLib.validate("./uploads/"+fileList[i])) {
      
      let attrs = getFileAttr("./uploads/"+fileList[i]);
      JSONList.push(attrs[0]);
      fileSizeArr.push(attrs[1]);
    } 
    


  }

  //console.log(JSONList);
  res.send({
    jList: JSONList,
    sizeArr: fileSizeArr
  });

})

app.get('/svgComponents', function(req , res) {

  let desc = sharedLib.getDesc("./uploads/"+req.query.svgFile);
  let rList = sharedLib.rectListToJSON("./uploads/"+req.query.svgFile);
  let cList = sharedLib.circListToJSON("./uploads/"+req.query.svgFile);
  let pList = sharedLib.pathListToJSON("./uploads/"+req.query.svgFile);
  let gList = sharedLib.groupListToJSON("./uploads/"+req.query.svgFile);
  
  res.send({
    tAndD: desc,
    rects: rList,
    circs: cList,
    paths: pList,
    groups: gList
    
  });

  
});

function getFileAttr(fileName) {

  let attr = [];

  attr.push(sharedLib.SVGtoJSON(fileName));

  let stats = fs.statSync(fileName);
  let fileSizeinByte = stats["size"];
  let fileSize = fileSizeinByte / 1000;
  attr.push(fileSize);

  return attr;

}

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);



