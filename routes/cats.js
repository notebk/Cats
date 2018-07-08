var path = require("path");
var express = require('express');
var catData = require("./catData");
var catModel = require('../models/catModel.js');
var router = express.Router();


//Code obtained from original olinjs homework solution after failed git push that lost all my data
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
// save cat to database
  var newCat = new catModel(catObj);
    newCat.save(function(err) {
      if(err) {
        res.status(500).send('Something broke!');
      } else {
    res.render("cats", {
      message: "New cat created:",
      cats: [catObj] 
      });
    }
  });
};

cats.list = function(req, res) {
  var colorFilter;
  var message = "Cats by age:";
  // use find() first, otherwise sort won't work
  catModel.find().sort({age: -1})
    .exec(function(err, cats) {
    if (err) {
      res.status(500).send("Something broke!");
    } else {
      res.render("cats", {
        message: message,
        cats: cats
      })
    }
  })
};

cats.byColor = function(req, res) {
  var colorFilter;
  var message; 

  if (req.params.color) {
    colorFilter = req.params.color.toLowerCase();
    message = "Cats by age with color " + req.params.color+ ":";
  } else {
    colorFilter = 'none';
    message = "Cats by age:";
  }
  catModel.find({colors: colorFilter})
          .sort({age: -1})
          .exec(function(err, cats) {
            if (err) {
              res.status(500).send("Something broke!");
            } else {
      res.render("cats", {
        message: message,
        cats: cats
      })
    }
  })
};

cats.delete = function(req, res) {
  catModel.findOneAndRemove({},{sort: {age: -1}}, function(err, cat) {
    if (err) {
      res.status(500).send("Something broke!");
    } else {
      var deadCat = [cat];
      var message = "A cat died!";
    }
  })
};
module.exports = cats;