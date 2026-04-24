import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'quadrinhos.db';

export async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  try {
    // Criar tabela de quadrinhos
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS quadrinhos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        editora TEXT NOT NULL,
        anoPublicacao INTEGER NOT NULL,
        descricao TEXT,
        dataCriacao TEXT NOT NULL
      );
    `);

    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    throw error;
  }

  return db;
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
}
