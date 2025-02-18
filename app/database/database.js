import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('routes.db');

//creeer database tabel
export const setupDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS routes (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT);"
        );
    });
};

//route opslaan als JSON
export const saveRoute = (route) => {
    db.transaction((tx) => {
        tx.executeSql('INSERT INTO routes (data) VALUES (?);', [JSON.stringify(route)]);
    });
};

//alle routes opslaan
export const getRoutes = (callback) => {
    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM routes;', [], (_, { rows }) => {
            const routes = rows._array.map((row) => JSON.parse(row.data));
            callback(routes);
        });
    });
};