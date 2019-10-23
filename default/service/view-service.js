const pool = require("../lib/sql").getPool();

/**
 * 종목 상세보기 화면의 데이터들을 DB에서 쿼리
 */
function get(ticker) {
  return new Promise((resolve, reject) => {
    try {
      var q = `select basic.ticker,price.close,price.open,price.high,price.low,price.chang,price.changpercent,price.gappercent,
            basic.companyname,basic.sector,basic.industry,basic.exchange,basic.avg30volume,
            valuation.marketcap,valuation.sharesoutstanding,valuation.employees,performance.d5cp,performance.d30cp,performance.m3cp,performance.y1cp,
            technical.w52h,technical.w52l,technical.w52hp,technical.w52lp,technical.w52c,
            financial.pe,financial.forwardpe,financial.eps,financial.forwardeps,financial.peg,financial.payoutratio,financial.dividendyield,financial.beta,
            financial.nextearningsdate,financial.nextdividenddate,financial.exdividenddate,
            balancesheet.grossp,balancesheet.ebitda,balancesheet.totalcash,balancesheet.totaldebt,balancesheet.totalrevenue,
            margins.ebitdam,margins.profitm,margins.grossm,margins.operatingm,
            cashflow.ocashflow,cashflow.fcashflow,
            worth.evr,worth.evebit,worth.roa,worth.dte,worth.roe,worth.rps,worth.totalcps,
            her.earnings_0y,her.earnings_1y,her.earnings_2y,her.earnings_3y,her.earnings_0q,her.earnings_1q,her.earnings_2q,her.earnings_3q,
            her.revenue_0y,her.revenue_1y,her.revenue_2y,her.revenue_3y,her.revenue_0q,her.revenue_1q,her.revenue_2q,her.revenue_3q,
            her.date_0y,her.date_1y,her.date_2y,her.date_3y,her.date_0q,her.date_1q,her.date_2q,her.date_3q,
            growth.eg_0y,growth.eg_1y,growth.eg_2y,growth.eg_0q,growth.eg_1q,growth.eg_2q,
            growth.rg_0y,growth.rg_1y,growth.rg_2y,growth.rg_0q,growth.rg_1q,growth.rg_2q,
            fownership.forgan0,fownership.forgan1,fownership.forgan2,fownership.forgan3,fownership.forgan4,fownership.forgan5,fownership.forgan6,fownership.forgan7,fownership.forgan8,fownership.forgan9,
            fownership.fpctheld0,fownership.fpctheld1,fownership.fpctheld2,fownership.fpctheld3,fownership.fpctheld4,fownership.fpctheld5,fownership.fpctheld6,fownership.fpctheld7,fownership.fpctheld8,fownership.fpctheld9,
            ownership.organ0,ownership.organ1,ownership.organ2,ownership.organ3,ownership.organ4,ownership.organ5,ownership.organ6,ownership.organ7,ownership.organ8,ownership.organ9,
            ownership.pctheld0,ownership.pctheld1,ownership.pctheld2,ownership.pctheld3,ownership.pctheld4,ownership.pctheld5,ownership.pctheld6,ownership.pctheld7,ownership.pctheld8,ownership.pctheld9
            from basic
                left outer join price using(ticker) 
                left outer join valuation using(ticker) 
                left outer join performance using(ticker)
                left outer join technical using(ticker)
                left outer join financial using(ticker)
                left outer join balancesheet using(ticker)
                left outer join margins using(ticker)
                left outer join cashflow using(ticker)
                left outer join worth using(ticker)
                left outer join her using(ticker)
                left outer join growth using(ticker)
                left outer join fownership using(ticker)
                left outer join ownership using(ticker)
            where ticker = '${ticker}'`;
      pool.query(q, function(err, results, fields) {
        if (err) return reject(err);
        return resolve(results[0]);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  get
};
