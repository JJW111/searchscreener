"use strict";

var config = require("./lib/config");

var express = require("express");

var helmet = require("helmet");

var app = express();

var i18n = require("./lib/i18n");

var index = require("./router/index");

var search = require("./router/search");

var view = require("./router/view");

var visitor = require("./router/visitor");

var ajax = require("./router/ajax");

var bodyParser = require("body-parser");

app.set("view engine", "pug");

app.set("views", config.viewPath);

// 로컬 테스트 환경을 위해 주석처리
// app.use((req, res, next) => {
//     var proto = req.header('X-FORWARDED-PROTO');
//     if (proto == 'https') {
//         next();
//     } else {
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });

app.use(helmet.xssFilter());
app.use(helmet.frameguard());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(i18n);

app.use(index);

app.use("/search", search);

app.use("/ajax", ajax);

app.use("/view", view);

app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.render("error/500");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {});
