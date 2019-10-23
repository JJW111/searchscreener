const {
  TABLEMAP,
  STRING_LIST,
  OPERATOR_LIST,
  OPERATOR_BETWEEN,
  SELECT_DATE_LIST,
  SELECT_DATE_VALID_LIST,
  SELECT_RATING_VALID_LIST,
  CHECKBOX_ONE_LIST
} = require("./global");

/**
 * 조건에 맞는 종목데이터를 쿼리하기 위한 SQL 쿼리문을 생성
 */
module.exports = function(param, view) {
  if (!view) throw new Error("view is not defined");

  var where = {};
  var columns = [];
  var tables = [];

  for (var key in param) {
    var lkey = key.toLowerCase();
    if (!TABLEMAP[lkey]) continue;

    var t = TABLEMAP[lkey];
    tables.push(t);

    if (!param[key]) continue;

    if (!where[lkey]) {
      where[lkey] = [];
    }

    if (STRING_LIST.includes(lkey)) {
      // string list
      var v = param[key].split(",");

      if (v.length === 0) continue;

      v.forEach((value, index) => {
        v[index] = `'${value}'`;
      });

      where[lkey].push(`${t}.${lkey} in (${v.toString()})`);
    } else if (SELECT_DATE_LIST.includes(lkey)) {
      // select date list
      var v = param[key];

      if (!SELECT_DATE_VALID_LIST.includes(v)) continue;

      where[lkey].push(`${t}.${lkey} = '${v}'`);
    } else if (lkey === "rating") {
      var v = param[key];

      if (!SELECT_RATING_VALID_LIST.includes(v)) continue;

      where[lkey].push(`${t}.${lkey} = '${v}'`);
    } else if (CHECKBOX_ONE_LIST.includes(lkey)) {
      // checkbox one lsit
      var v = param[key];

      if (!(v === "1" || v === "0")) continue;

      where[lkey].push(`${t}.${lkey} = ${v}`);
    } else {
      // range number
      var v = param[key].split("|");
      var operator = v[0];

      if (v.length === 2) {
        if (!OPERATOR_LIST.includes(operator)) continue;
        var v1 = +v[1];
        if (isNaN(v1)) continue;
        where[lkey].push(`${t}.${lkey} ${operator} ${v1}`);
      } else if (v.length === 3) {
        if (OPERATOR_BETWEEN !== operator) continue;
        var v1 = +v[1];
        if (isNaN(v1)) continue;
        var v2 = +v[2];
        if (isNaN(v2)) continue;
        if (v1 > v2) {
          var tmp = v1;
          v1 = v2;
          v2 = tmp;
        }
        where[lkey].push(`${t}.${lkey} between ${v1} and ${v2}`);
      }
    }
  }

  for (var i = 0; i < view.length; i++) {
    var tmp = TABLEMAP[view[i]] + "." + view[i];
    tables.push(TABLEMAP[view[i]]);
    columns.push(tmp);
  }

  if (tables.length == 0) throw new Error(`tables.length is zero`);
  if (columns.length == 0) throw new Error(`columns.length is zero`);

  var uniqueColumns = columns.filter(
    (value, idx, arr) => arr.indexOf(value) === idx
  );
  var uniqueTables = tables.filter(
    (value, idx, arr) => arr.indexOf(value) === idx
  );

  var tableJoin = `${uniqueTables[0]}`;

  for (var i = 1; i < uniqueTables.length; i++) {
    tableJoin += ` left outer join ${uniqueTables[i]} using (ticker) `;
  }

  var whereSql = "";

  if (Object.keys(where).length > 0) {
    for (var key in where) {
      var w = where[key];
      var s = "";

      if (w.length === 0) continue;

      if (whereSql.length > 0) whereSql += "and";

      for (var i = 0; i < w.length; i++) {
        if (s.length > 0) s += ` ${c} `;
        s += w[i];
      }
      if (s.length > 0) whereSql += " (" + s + ") ";
    }

    if (whereSql.length > 0) whereSql = " where " + whereSql;
  }

  var orderBy = "";

  if (param.order) {
    var o = param.order.toLowerCase();
    var order = o && TABLEMAP[o] + "." + o;

    if (TABLEMAP[o] && view && view.includes(o)) {
      orderBy = ` order by ${order} is null asc, ${order} `;

      if (param.dir) {
        var d = param.dir.toLowerCase();
        var dir = d !== "desc" ? "asc" : "desc";

        orderBy += dir;
      }
    }
  }

  if (orderBy.length === 0) {
    orderBy = " order by basic.ticker is null asc, basic.ticker asc ";
  }

  return {
    columns: uniqueColumns.join(",").toString(),
    tableJoin: tableJoin,
    where: whereSql,
    orderBy: orderBy
  };
};
