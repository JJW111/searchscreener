const pool = require("../lib/sql").getPool();

module.exports = {
  search,
  total,
  searchTicker
};

function search(q, offset, perPage) {
  return new Promise(async (resolve, reject) => {
    try {
      var offsetSql = "";
      if (offset) offsetSql = offset + ",";
      var sql =
        `select ${q.columns} from ` +
        q.tableJoin +
        q.where +
        q.orderBy +
        ` limit ` +
        offsetSql +
        perPage;

      pool.query(sql, function(err, results, fields) {
        if (err) return reject(err);
        return resolve(results);
      });
    } catch (err) {
      return reject(err);
    }
  });
}

function total(q) {
  return new Promise((resolve, reject) => {
    try {
      var sql = `select count(*) as cnt from ` + q.tableJoin + q.where;
      pool.query(sql, function(err, results, fields) {
        if (err) return reject(err);
        return resolve(results[0].cnt);
      });
    } catch (err) {
      return reject(err);
    }
  });
}

function searchTicker(text) {
  return new Promise((resolve, reject) => {
    try {
      if (text || text.length > 0) {
        var sql = `select ticker, companyNameUpper as name, exch as exchange from basic where ticker like '%${text}%' or companyNameUpper like '%${text}%' limit 30`;
        pool.query(sql, function(err, results, fields) {
          if (err) return reject(err);
          return resolve(results);
        });
      } else {
        return resolve(null);
      }
    } catch (err) {
      return reject(err);
    }
  });
}
