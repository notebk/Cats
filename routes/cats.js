var path = require("path");
var express = require('express');
var catData = require("./catData");
var Robot = require('../models/model.js');
var router = express.Router();
var db = require('../fakeDatabase');

//Code gotten from original olinjs homework solution after failed git push that lost all my data
//slightly reformatted to remove mongodb and mongoose connections

var colors = catData.colors;
var numColors = colors.length;
var names = catData.names;
var numNames = names.length;

var cats = {};

cats.new = function(req, res) {
  var catColors = [];
  for (var i = Math.floor(Math.random()*3)+1; i > 0; i--) {
    catColors.push(colors[Math.floor(Math.random()*numColors)].toLowerCase());
  }
//  catColors = catColors.filter(function(val, ind, arr) { return arr.indexOf(val) === ind;})
  var name = names[Math.floor(Math.random()*numNames)];
  var age = Math.floor(Math.random()*numNames);
  
  var catObj = {
    name: name,
    age: age,
    colors: catColors
  };
  var newCat = catObj;
    db.add(newCat);
    res.render("cats", {
      message: "New cat created:",
      cats: [catObj] 
      });
    };

  cats.list = function(req, res) {
  var catList = db.getAll();
  var colorFilter;
  var message = "Cats by age:";
  
  var filteredCats = catList.sort(function(a, b) {
        return b.age - a.age
      });
      res.render("cats", {
        message: message,
        cats: filteredCats
      })
};

cats.byColor = function(req, res) {
  var catList = db.getAll();
  var colorFilter;
  var message; 

  if (req.params.color) {
    colorFilter = req.params.color.toLowerCase();
    message = "Cats by age with color " + req.params.color+ ":";
  } else {
    colorFilter = 'none';
    message = "Cats by age:";
    };
    var filteredCats = catList.filter(function(item) {
    return item.colors.indexOf(colorFilter) > -1; });
    
    filteredCats = filteredCats.sort(function(a, b) {
      return b.age - a.age});

    res.render("cats", {
      message: message,
      cats: filteredCats
    });
  };

cats.delete = function(req, res) {
//  var catList = db.getAll();
  var message = "This Cat Died:";

// var filteredCats = catList.sort(function(a, b) {
//    return b.age - a.age});  
   
db.data.sort(function(a, b) {
  return b.age - a.age});  

var oldCat = db.data[0];
var index = 0;
  
  db.remove(index);
  
  res.render("cats", {
    message: message,
    cats: [oldCat]
  });
};
module.exports = cats;