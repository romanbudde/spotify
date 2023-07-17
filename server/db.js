const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "123456",
    host: "db",
    port: "5432",
    database: "db_cuidadores"
});

module.exports = pool;