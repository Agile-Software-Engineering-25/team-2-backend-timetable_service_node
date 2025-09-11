//Todoimport sqlite3 from "sqlite3"
const sqlite3 = require("sqlite3")
const pkg = require("pg")

const isDev = process.env.NODE_ENV !== "prod"
console.log(process.env.NODE_ENV)
let client
async function initDB() {
    if (isDev) {
        // SQLite
        client = new sqlite3.Database("./dev.db")
        // Foreign keys aktivieren (wichtig für Kompatibilität mit Postgres)
        client.exec("PRAGMA foreign_keys = ON;")
    } else {
        // Postgres
        const { Client } = pkg
        client = new Client({
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "postgres",
            database: process.env.DB_NAME || "testdb",
        })
        await client.connect()
        console.log("Postgres Datenbank verbunden")
    }
}

/**
 * SQL-Abfragen ausführen
 * @param {string} sql - Das SQL-Statement
 * @param {Array} params - Parameter (Platzhalter: ? bei SQLite, $1,$2,... bei Postgres)
 */
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (isDev) {
            // SQLite erwartet ?-Platzhalter
            client.all(sql, params, (err, rows) => {
                if (err) reject(err)
                else resolve(rows)
            })
        } else {
            // Postgres erwartet $1, $2,... Platzhalter
            client.query(sql, params)
                .then(res => resolve(res.rows))
                .catch(reject)
        }
    })
}

module.exports = { initDB, query }
