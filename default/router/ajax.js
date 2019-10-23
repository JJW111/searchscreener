"use strict";

var express = require("express");

var router = express.Router();

var search = require("../service/search-service");

var columnsService = require("../service/columns-service");

var searchService = require("../service/search-service");

const { check, validationResult } = require("express-validator/check");

router.use((req, res, next) => {
  var isAjaxRequest = req.xhr;
  if (isAjaxRequest) {
    next();
  } else {
    res.status(403).send("Not allowed");
  }
});

router.get("/search/ticker", async (req, res) => {
  try {
    var json = await searchService.searchTicker(req.query.text);
    res.status(200).send(json);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

module.exports = router;
