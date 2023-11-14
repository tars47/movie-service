const { Pool } = require("pg");
const types = require("pg").types;

types.setTypeParser(types.builtins.DATE, value => value);
types.setTypeParser(types.builtins.NUMERIC, value => value * 1);

const pool = new Pool({
  max: process.env.PG_CONN_LIMIT,
  idleTimeoutMillis: process.env.PG_IDLE_TIMEOUT,
  connectionTimeoutMillis: process.env.PG_CON_TIMEOUT,
});

module.exports = pool;
