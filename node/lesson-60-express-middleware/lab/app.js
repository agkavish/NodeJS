'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var morgan = require('morgan');

var LOGGER = ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" REQUEST-COOKIE:req[Cookie] RESPONSE-COOKIE:res[Cookie]';

var app = express();
app.use(morgan(LOGGER));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'node is fun' }));
app.use(login);
app.use(checkAuth);

function login(request, response, next){
    if(request.method !== 'GET'){
        return next();
    }
    console.log("Session " + request.session.user);
    if(request.session.user){
        response.setHeader('Content-Type', 'text/html');
        response.write('Hello ' + request.session.user + '<br/><br/>');
        response.write('<form method="post" action="/?_method=DELETE">');
        response.write('<input type="submit" value="Logout" />');
        response.write('</form>');
        response.end();

    } else {
        response.setHeader("Content-Type", 'text/html');
        response.write('Please log in <br/><br/>');
        response.write('<form method="post">');
        response.write('<input type="text" name="user" />');
        response.write('<input type="password" name="password" />');
        response.write('<input type="submit" value="Login" />');
        response.write('</form>');
        response.end();
    }
};

function checkAuth(req, res, next){
  if('POST' != req.method){
      return next();
  }
    if(req.body.user === 'admin' && req.body.password === 'password'){
        req.session.regenerate(function createSession(err) {
            if (err) {
                console.log(err);
            }
            req.session.user = req.body.user;
            res.end("You are now logged in.");
        });

    } else {
        res.write('Invalid login details');
        res.end();
    }
};

app.use(function logout(req, res) {
    if ('DELETE' !== req.method) {
        res.end("Unexpected server error!");
    }
    req.session.destroy(function logout(err) {
        if (err) {
            console.log(err);
        }
        res.end("Logged out!");
    });
});

app.listen(3001);
