'use strict'

var express = require('express');

var router = express.Router();

var visitor = require('./visitor');

var columnsService = require('../service/columns-service');

var categoryService = require('../service/category-service');

var filterService = require('../service/filter-service');

var query = require('../service/query');

var pagination = require('../service/pagination');

var searchService = require('../service/search-service');

var doAsync = require('../lib/do-async');

const emptyFilter = {
    marketcap: '>|1000000',
    avg30volume: '>|50000',
    pe: '>|0'
}

router.use(visitor);

router.get('/', doAsync(async (req, res) => {
    var columns = await columnsService.get(req.query.view || 'overview');

    var filterList = filterService.getFilterList(req.query);
    var f = req.query;

    if (filterList.length === 0) {
        var tempFilter = emptyFilter;
        tempFilter.order = req.query.order;
        tempFilter.dir = req.query.dir;
        f = tempFilter;
        filterList = filterService.getFilterList(f);
    }

    var q = query(f, columns);
    
    var total = await searchService.total(q);
    var paging = await pagination(total, req.query.page, req.query.per);

    var list = await searchService.search(q, paging.offset, paging.perPage);
    var category = await categoryService();
    var view = columnsService.list(req.query.view || 'overview');

    res.render('search', { columns: columns, list: list, category: category, 
        condition: JSON.stringify(req.query), filterList: filterList, 
        paging: paging, view: view, order: req.query.order || 'ticker', dir: req.query.dir || 'asc' });
}));

module.exports = router;