"use strict";

var express = require('express');

var http = require('http');

var bcrypt = require('bcrypt');

var path = require("path");

var bodyParser = require('body-parser');

var users = require('./data/data').userDB;

var app = express();
var server = http.createServer(app);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, './public')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
app.post('/register', function _callee(req, res) {
  var foundUser, hashPassword, newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          foundUser = users.find(function (data) {
            return req.body.email === data.email;
          });

          if (foundUser) {
            _context.next = 12;
            break;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 5:
          hashPassword = _context.sent;
          newUser = {
            id: Date.now(),
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
          };
          users.push(newUser);
          console.log('User list', users);
          res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
          _context.next = 13;
          break;

        case 12:
          res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");

        case 13:
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          res.send("Internal server error");

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
app.post('/login', function _callee2(req, res) {
  var foundUser, submittedPass, storedPass, passwordMatch, usrname, fakePass;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          foundUser = users.find(function (data) {
            return req.body.email === data.email;
          });

          if (!foundUser) {
            _context2.next = 11;
            break;
          }

          submittedPass = req.body.password;
          storedPass = foundUser.password;
          _context2.next = 7;
          return regeneratorRuntime.awrap(bcrypt.compare(submittedPass, storedPass));

        case 7:
          passwordMatch = _context2.sent;

          if (passwordMatch) {
            usrname = foundUser.username;
            res.send("<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ".concat(usrname, "</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>"));
          } else {
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
          }

          _context2.next = 15;
          break;

        case 11:
          fakePass = "$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga";
          _context2.next = 14;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, fakePass));

        case 14:
          res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");

        case 15:
          _context2.next = 20;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](0);
          res.send("Internal server error");

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 17]]);
});
server.listen(3000, function () {
  console.log("server is listening on port: 3000");
});