const { Pool } = require('pg');

// const pool = new Pool({
//     user: "postgres",
//     password: "123456",
//     host: "db",
//     port: "5432",
//     database: "db_cuidadores"
// });

// prod credentials
const pool = new Pool({
    user: "radmin",
    password: "B5qPiSbzg459W1yZAIZBG63dpI0uBpHj",
    host: "dpg-civk1aunqql48o6k1at0-a.oregon-postgres.render.com",
    port: "5432",
    database: "db_cuidadores"
});

module.exports = pool;