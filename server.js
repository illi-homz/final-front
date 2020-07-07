const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
var history = require("connect-history-api-fallback");

const app = express();

let https_redirect = function(req, res, next) {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] != "https") {
      return res.redirect("https://" + req.headers.host + req.url);
    } else {
      return next();
    }
  } else {
    return next();
  }
};

app.use(https_redirect);
app.use(history());
app.use('/', serveStatic(path.join(__dirname, '/dist')));

const port = process.env.PORT || 8080;
app.listen(port);

console.log('Listening on port: ' + port);
