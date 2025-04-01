const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('userdata.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        userId TEXT PRIMARY KEY,
        username TEXT,
        xp INTEGER DEFAULT 0,
        lastMessage INTEGER DEFAULT 0
    )`);
});

function addXP(userId, username, amount) {
    const now = Date.now();
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO users (userId, username, xp, lastMessage)
        VALUES (?, ?, COALESCE((SELECT xp + ? FROM users WHERE userId = ?), ?), ?)
    `);
    stmt.run(userId, username, amount, userId, amount, now);
    stmt.finalize();
}

function getRanking(callback) {
    db.all('SELECT username, xp FROM users ORDER BY xp DESC LIMIT 10', callback);
}

module.exports = {
    addXP,
    getRanking
};
