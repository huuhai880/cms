const config = require('../../../config/config').sql;
const sql = require('mssql');

// console.log({ config });
const pool = new sql.ConnectionPool(config)
  .connect()
  .then((poolConnect) => {
    return poolConnect;
  })
  .catch((err) => {
    console.log('Database Connection Failed! Bad Config: ', err);
  });

module.exports = {
  sql,
  pool,
};
