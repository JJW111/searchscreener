const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore();

const viewMap = {
    overview: ['ticker', 'companyname', 'close', 'changpercent', 'gappercent', 'pe', 'rating', 'sector', 'exch'],
    valuation: ['ticker', 'marketcap', 'peg', 'pe', 'forwardpe', 'w52hp', 'w52lp', 'eps', 'forwardeps'],
    performance: ['ticker', 'd5cp', 'd30cp', 'm1cp', 'm3cp', 'm6cp', 'ytdcp', 'y1cp', 'y2cp', 'y5cp'],
    dividend: ['ticker', 'dividendyield', 'nextdividenddate', 'exdividenddate', 'nextearningsdate'],
    balancesheet: ['ticker', 'totalrevenue', 'grossp', 'ebitda', 'totalcash', 'totaldebt', 'ocashflow', 'fcashflow'],
    growth: ['ticker', 'earnings_0y', 'earnings_0q', 'revenue_0y', 'revenue_0q', 'eg_0y', 'eg_0q', 'rg_0y', 'rg_0q'],
    worth: ['ticker', 'evr', 'evebit', 'roe', 'roa', 'dte', 'rps', 'totalcps'],
    margins: ['ticker', 'grossm', 'operatingm', 'profitm', 'ebitdam']
}

const viewList = [
    { k: 'overview', v: 'Overview' },
    { k: 'valuation', v: 'Valuation' },
    { k: 'performance', v: 'Performance' },
    { k: 'dividend', v: 'Dividend' },
    { k: 'balancesheet', v: 'Balance Sheet' },
    { k: 'growth', v: 'Growth' },
    { k: 'worth', v: 'Worth' },
    { k: 'margins', v: 'Margins' }
];


function get(view) {
    return new Promise((resolve, reject) => {
        try {
            var columns = null;

            var isMember = false;

            // 회원이면 회원정보에서 custom view 데이터 로드
            if (view) {
                columns = getColumns(view);
            } else { // 비회원이면 기본 view로 처리
                if (isMember) {

                } else {
                    columns = getColumns('overview');
                }
            }

            resolve(columns);
        } catch (err) {
            reject(err);
        }
    })
}


function list(view) {
    var l = {};
    l.list = viewList;
    l.currentView = view.toLowerCase();
    return l;
}


function getColumns(view) {
    var res = viewMap[view];
    return res || viewMap.overview;
}


module.exports = {
    get,
    list
}