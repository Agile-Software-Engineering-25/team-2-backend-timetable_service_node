//Todoimport sqlite3 from "sqlite3"
const sqlite3 = require("sqlite3")
const pkg = require("pg")
const logger = require("./logger")
const fs = require('fs')
const isDev = process.env.NODE_ENV !== "prod"
console.log(process.env.NODE_ENV)
let client
async function initDB() {
    if (isDev) {
        // SQLite
        let new_db = false;
        if (!fs.existsSync("./dev.db")) {
            new_db = true;
        }

        client = new sqlite3.Database("./dev.db")
        // Foreign keys aktivieren (wichtig für Kompatibilität mit Postgres)
        client.exec("PRAGMA foreign_keys = ON;")
        if (new_db) {
            query(fs.readFileSync("./sql/init.sql", "utf-8"))
            logger.info("New SLQLite DB created")
        }
    } else {
        // Postgres
        const { Client } = pkg
        client = new Client({
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "postgres.db",
            database: process.env.DB_NAME || "appdb",
        })

        await client.connect();
        logger.info("Conneted to db")
        await ensureDbInitialized(client)
        try {
            await client.query(`SET search_path TO ${process.env.DB_SCHEMA || "ase-2_schema"};`);
        } catch (error) {
            logger.error(error, "Could not select db schema")
        }
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
                if (err) { logger.error(err, "DB Error"); reject(err) }
                else resolve(rows)
            })
        } else {
            // Postgres erwartet $1, $2,... Platzhalter
            client.query(normalizeQuery(sql), params)
                .then(res => resolve(res.rows))
                .catch(reject)
        }
    })
}
function normalizeQuery(query) {
    let i = 0;
    return query.replace(/\?/g, () => `$${++i}`);
}

async function ensureDbInitialized(pool) {
    // Schritt 1: Warten bis DB erreichbar ist
    let connected = false;
    while (!connected) {
        try {
            await pool.query('SELECT 1');
            connected = true;
        } catch (err) {
            logger.error('DB nicht erreichbar – versuche erneut in 2s...');
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // Schritt 2: Prüfen, ob eine Tabelle existiert
    try {
        await pool.query('SELECT 1 FROM your_table LIMIT 1;');
        logger.info('DB bereits initialisiert ✅');
        return;
    } catch { }

    // Schritt 3: Init.sql ausführen
    logger.info('DB wird initialisiert...');
    const initSql = fs.readFileSync('./sql/schema.sql', 'utf-8');
    logger.info(initSql)

    await pool.query(initSql);
    logger.info('DB initialisiert ✅');
}

module.exports = { initDB, query }
