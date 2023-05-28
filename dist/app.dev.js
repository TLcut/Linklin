"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require("./data/data"),
    userDB = _require.userDB;

var path = require("path");

var bodyParser = require("body-parser");

var http = require("http");

var express = require("express");

var uuid4 = require('uuid4');

var cookieParser = require('cookie-parser');

var _require2 = require("request"),
    cookie = _require2.cookie;

var _require3 = require("pug"),
    render = _require3.render;

var app = express();
var server = http.createServer(app);
var PORT = 3000;
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, "public")));
app.use(cookieParser(uuid4()));
app.set("views", path.join(__dirname, "public", "views"));
app.set("view engine", "pug");
app.get('/', function (req, res) {
  res.clearCookie('username');
  res.clearCookie('id');
  return res.render('index');
});
app.get('/login', function (req, res) {
  return res.render('login');
});
app.get('/signup', function (req, res) {
  return res.render('signup');
});
app.get('/user/:username', function (req, res) {
  try {
    console.log(req.signedCookies);
    console.log(req.params.username);
    var findUser = userDB.find(function (data) {
      return data.username === req.params.username;
    });
    console.log(findUser);

    if (findUser) {
      if (req.signedCookies.id === findUser.id) {
        res.render('links', {
          username: findUser.username,
          list: findUser.list
        });
      } else {
        return res.redirect('/');
      }
    } else {
      return res.redirect('/');
    }
  } catch (_unused) {
    return res.send("伺服器錯誤:(" + err);
  }
});
app.post('/signup', function (req, res) {
  try {
    var findUser = userDB.find(function (data) {
      return data.id === req.body.id;
    });

    if (!findUser) {
      var newUser = {
        username: req.body.username,
        id: req.body.id,
        password: req.body.password,
        list: []
      };
      userDB.push(newUser);
      res.cookie('username', newUser.username, {
        signed: true
      });
      res.cookie('id', newUser.id, {
        signed: true
      });
      return res.redirect("/user/".concat(newUser.username));
    } else {
      return res.redirect("/login");
    }
  } catch (err) {
    return res.send("伺服器錯誤:(" + err);
  }
});
app.post('/login', function (req, res) {
  try {
    var findUser = userDB.find(function (data) {
      return data.id === req.body.id;
    });

    if (findUser && req.body.password === findUser.password) {
      res.cookie('username', findUser.username, {
        signed: true
      });
      res.cookie('id', findUser.id, {
        signed: true
      });
      console.log(req.signedCookies);
      return res.redirect("/user/".concat(findUser.username));
    } else {
      return res.render('login', {
        message: "查無此帳"
      });
    }
  } catch (_unused2) {
    return res.send("伺服器錯誤:(" + err);
  }
});
app.post('/user/:username', function (req, res) {
  try {
    var findUserIDX = userDB.findIndex(function (data) {
      return data.username === req.signedCookies.username;
    });
    var newLink = req.body.title + "\t" + req.body.link;
    console.log(findUserIDX.list);
    userDB[findUserIDX].list = [].concat(_toConsumableArray(userDB[findUserIDX].list), [newLink]);
    return res.redirect("/user/".concat(req.signedCookies.username));
  } catch (err) {
    return res.send("伺服器錯誤:(" + err);
  }
});
server.listen(PORT, function () {
  console.log("server is listening on http://localhost:".concat(PORT));
});