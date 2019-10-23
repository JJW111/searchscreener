const { DEFAULT_PER_PAGE, PER_PAGE_LIST } = require('./global');

module.exports = function (total, page, perPage) {
    var per = (perPage && PER_PAGE_LIST.includes(+perPage)) ? +perPage : DEFAULT_PER_PAGE;
    var maxPage = parseInt(total / per);

    total/per !== maxPage && maxPage++;

    var p = (page && !isNaN(+page)) ? parseInt(+page) : 1;
    if (p > maxPage) p = maxPage;
    if (p < 1) p = 1;
    
    var prevPage = -1;
    var nextPage = -1;

    if (p - 1 > 0)
        prevPage = p - 1;
    if (p + 1 <= maxPage)
        nextPage = p + 1;

    return {
        offset: (p - 1) * per,
        total: total,
        perPage: per,
        currentPage: p,
        maxPage: maxPage,
        prevPage: prevPage,
        nextPage: nextPage,
        currentPerPage: per,
        perPageList: PER_PAGE_LIST
    }
}