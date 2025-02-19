import * as SQLite from "expo-sqlite";

export async function openDatabase() {
    return await SQLite.openDatabaseAsync("routes.db");
}

// db tabel aan maken
export async function setupDatabase() {
    const db = await openDatabase();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS routes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT
        );
    `);
    console.log("✅ Database setup complete");
}

// Route opslaan als JSON
export async function saveRoute(route) {
    const db = await openDatabase();
    await db.runAsync(
        "INSERT INTO routes (data) VALUES (?);",
        [JSON.stringify(route)]
    );
    console.log("✅ Route saved");
}

// Routes ophalen
export async function getRoutes() {
    const db = await openDatabase();
    const results = await db.getAllAsync("SELECT * FROM routes;");
    
    return results.map(row => JSON.parse(row.data));
}
