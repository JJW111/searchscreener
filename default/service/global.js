const TABLEMAP = {
    close: 'price',
    open: 'price',
    high: 'price',
    low: 'price',
    gappercent: 'price',
    chang: 'price',
    changpercent: 'price',
    ticker: 'basic',
    companyname: 'basic',
    sector: 'basic',
    industry: 'basic',
    exchange: 'basic',
    exch: 'basic',
    avg10volume: 'basic',
    avg30volume: 'basic',
    marketcap: 'valuation',
    sharesoutstanding: 'valuation',
    employees: 'valuation',
    pe: 'financial',
    forwardpe: 'financial',
    eps: 'financial',
    forwardeps: 'financial',
    peg: 'financial',
    rating: 'financial',
    payoutratio: 'financial',
    dividendyield: 'financial',
    ttmdividendrate: 'financial',
    beta: 'financial',
    nextdividenddate: 'financial',
    exdividenddate: 'financial',
    nextearningsdate: 'financial',
    ned: 'financial',
    ndd: 'financial',
    edd: 'financial',
    d5cp: 'performance',
    d30cp: 'performance',
    m1cp: 'performance',
    m3cp: 'performance',
    m6cp: 'performance',
    ytdcp: 'performance',
    y1cp: 'performance',
    y2cp: 'performance',
    y5cp: 'performance',
    w5c: 'technical',
    w52hp: 'technical',
    w52lp: 'technical',
    newhigh: 'technical',
    newlow: 'technical',
    grossp: 'balancesheet',
    ebitda: 'balancesheet',
    totalcash: 'balancesheet',
    totaldebt: 'balancesheet',
    totalrevenue: 'balancesheet',
    ebitdam: 'margins',
    profitm: 'margins',
    grossm: 'margins',
    operatingm: 'margins',
    ocashflow: 'cashflow',
    fcashflow: 'cashflow',
    evr: 'worth',
    evebit: 'worth',
    roa: 'worth',
    dte: 'worth',
    roe: 'worth',
    rps: 'worth',
    totalcps: 'worth',
    earnings_0y: 'her',
    earnings_1y: 'her',
    earnings_2y: 'her',
    earnings_3y: 'her',
    earnings_0q: 'her',
    earnings_1q: 'her',
    earnings_2q: 'her',
    earnings_3q: 'her',
    revenue_0y: 'her',
    revenue_1y: 'her',
    revenue_2y: 'her',
    revenue_3y: 'her',
    revenue_0q: 'her',
    revenue_1q: 'her',
    revenue_2q: 'her',
    revenue_3q: 'her',
    date_0y: 'her',
    date_1y: 'her',
    date_2y: 'her',
    date_3y: 'her',
    date_0q: 'her',
    date_1q: 'her',
    date_2q: 'her',
    date_3q: 'her',
    eg_0y: 'growth',
    eg_1y: 'growth',
    eg_2y: 'growth',
    eg_0q: 'growth',
    eg_1q: 'growth',
    eg_2q: 'growth',
    rg_0y: 'growth',
    rg_1y: 'growth',
    rg_2y: 'growth',
    rg_0q: 'growth',
    rg_1q: 'growth',
    rg_2q: 'growth'
}

const STRING_LIST = [
    'ticker', 'exchange', 'companyName', 'sector', 'industry'
]


const OPERATOR_LIST = [
    '>', '<'
]

const OPERATOR_BETWEEN = '><'


const SELECT_DATE_LIST = [
    'ned', 'ndd'
]

const SELECT_DATE_VALID_LIST = [
    '1w', '1m', '3m', '6m', 'g6m'
]

const SELECT_RATING_VALID_LIST = [
    'strong_buy', 'buy', 'hold', 'sell', 'strong_sell'
]

const CHECKBOX_ONE_LIST = [
    'newhigh', 'newlow'
]

const PER_PAGE_LIST = [
    20, 40, 60, 80, 100
]

const DEFAULT_PER_PAGE = PER_PAGE_LIST[0];

module.exports = {
    TABLEMAP,
    STRING_LIST,
    OPERATOR_LIST,
    OPERATOR_BETWEEN,
    SELECT_DATE_LIST,
    SELECT_DATE_VALID_LIST,
    SELECT_RATING_VALID_LIST,
    CHECKBOX_ONE_LIST,
    DEFAULT_PER_PAGE,
    PER_PAGE_LIST
}