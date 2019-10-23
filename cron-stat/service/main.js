const Firestore = require("@google-cloud/firestore");

const firestore = new Firestore();

const sql = require("../lib/sql");

/**
 * seachscreener.com 홈화면의 Rank 리스트를 MySQL 에서 쿼리후에 Google Firestore 에 저장한다.
 */
function update() {
  return new Promise(async (resolve, reject) => {
    try {
      // mysql 쿼리
      var evrasc =
        "select basic.ticker, worth.evr, performance.m3cp from valuation left outer join basic using (ticker) left outer join performance using (ticker) left outer join worth using (ticker)  where  (valuation.marketcap > 500000000) and (basic.avg30volume > 50000) and (worth.evr > 0) and (worth.evebit > 0) and (worth.roa > 0) and (worth.roe > 0)  order by worth.evr is null asc, worth.evr asc limit 10";
      var evrdesc =
        "select basic.ticker, worth.evr, performance.m3cp from valuation left outer join basic using (ticker) left outer join performance using (ticker) left outer join worth using (ticker)  where  (valuation.marketcap > 500000000) and (basic.avg30volume > 50000) and (worth.evr > 0) and (worth.evebit > 0) and (worth.roa > 0) and (worth.roe > 0)  order by worth.evr is null asc, worth.evr desc limit 10";
      var dividenddesc =
        "select basic.ticker,financial.dividendyield,financial.nextdividenddate from valuation left outer join basic using (ticker)  left outer join financial using (ticker)  where  (valuation.marketcap > 500000000) and (basic.avg30volume > 50000) and (financial.nextdividenddate is not null) order by financial.dividendyield is null asc, financial.dividendyield desc limit 10";
      var evebitasc =
        "select basic.ticker, worth.evebit, performance.m3cp from valuation left outer join basic using (ticker) left outer join performance using (ticker) left outer join worth using (ticker)  where  (valuation.marketcap > 500000000) and (basic.avg30volume > 50000) and (worth.evr > 0) and (worth.evebit > 0)  order by worth.evebit is null asc, worth.evebit asc limit 10";
      var evebitdesc =
        "select basic.ticker, worth.evebit, performance.m3cp from valuation left outer join basic using (ticker) left outer join performance using (ticker) left outer join worth using (ticker)  where  (valuation.marketcap > 500000000) and (basic.avg30volume > 50000) and (worth.evr > 0) and (worth.evebit > 0)  order by worth.evebit is null asc, worth.evebit desc limit 10";
      var profitmargindesc =
        "select basic.ticker,margins.operatingm,margins.profitm from valuation left outer join basic using (ticker)  left outer join margins using (ticker)  where  (valuation.marketcap > 500000000) and (basic.avg30volume > 50000) and (margins.ebitdam > 0) and (margins.profitm > 0) and (margins.operatingm > 0) and (margins.grossm > 0)  order by margins.profitm is null asc, margins.profitm desc limit 10";
      var eg0ydesc =
        "select basic.ticker,her.earnings_0y,growth.eg_0y from valuation left outer join basic using (ticker) left outer join growth using (ticker)  left outer join her using (ticker)  where  (valuation.marketcap > 500000000) and (basic.avg30volume > 50000) and (growth.eg_0y > 0) and (growth.eg_0q > 0) and (her.earnings_0y > 100000000) and (her.earnings_0q > 10000000) order by growth.eg_0y is null asc, growth.eg_0y desc limit 10";
      var rg0ydesc =
        "select basic.ticker,her.revenue_0y,growth.rg_0y from valuation left outer join basic using (ticker) left outer join growth using (ticker)  left outer join her using (ticker)  where  (valuation.marketcap > 500000000) and (basic.avg30volume > 50000) and (growth.rg_0q > 0) and (growth.rg_0y > 0) and (her.revenue_0y > 100000000) and (her.revenue_0q > 10000000)  order by growth.rg_0y is null asc, growth.rg_0y desc limit 10";
      var grosspdesc =
        "select basic.ticker,balancesheet.totalrevenue,balancesheet.grossp from valuation left outer join basic using (ticker)  left outer join balancesheet using (ticker)  left outer join cashflow using (ticker)  where  (valuation.marketcap > 1000000) and (basic.avg30volume > 50000) and (balancesheet.grossp > 0) and (balancesheet.totalrevenue > 0) and (balancesheet.ebitda > 0)  order by balancesheet.grossp is null asc, balancesheet.grossp desc limit 10";

      var evrasc_result = await sql.query(evrasc);
      var evrdesc_result = await sql.query(evrdesc);
      var dividend_result = await sql.query(dividenddesc);
      var evebitasc_result = await sql.query(evebitasc);
      var evebitdesc_result = await sql.query(evebitdesc);
      var profitmargindesc_result = await sql.query(profitmargindesc);
      var eg0ydesc_result = await sql.query(eg0ydesc);
      var rg0ydesc_result = await sql.query(rg0ydesc);
      var grosspdesc_result = await sql.query(grosspdesc);

      var docData = {
        evrasc: JSON.parse(JSON.stringify(evrasc_result)),
        evrdesc: JSON.parse(JSON.stringify(evrdesc_result)),
        dividend: JSON.parse(JSON.stringify(dividend_result)),
        evebitasc: JSON.parse(JSON.stringify(evebitasc_result)),
        evebitdesc: JSON.parse(JSON.stringify(evebitdesc_result)),
        profitmargindesc: JSON.parse(JSON.stringify(profitmargindesc_result)),
        eg0ydesc: JSON.parse(JSON.stringify(eg0ydesc_result)),
        rg0ydesc: JSON.parse(JSON.stringify(rg0ydesc_result)),
        grosspdesc: JSON.parse(JSON.stringify(grosspdesc_result))
      };

      // firestore 저장
      firestore
        .collection("rank")
        .doc(`main`)
        .set(docData, { merge: false });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  update
};
