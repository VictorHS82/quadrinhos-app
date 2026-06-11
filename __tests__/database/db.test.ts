import * as SQLite from 'expo-sqlite';
import { initializeDatabase, getDatabase } from '../../database/db';

jest.mock('expo-sqlite');

const mockOpenDatabaseAsync = SQLite.openDatabaseAsync as jest.MockedFunction<
  typeof SQLite.openDatabaseAsync
>;

const mockExecAsync = jest.fn();
const mockDb = { execAsync: mockExecAsync };

beforeEach(() => {
  jest.clearAllMocks();
  mockOpenDatabaseAsync.mockResolvedValue(mockDb as never);
});

describe('database/db', () => {
  describe('initializeDatabase', () => {
    it('should open the database and create the quadrinhos table', async () => {
      mockExecAsync.mockResolvedValue(undefined);

      const db = await initializeDatabase();

      expect(mockOpenDatabaseAsync).toHaveBeenCalledWith('quadrinhos.db');
      expect(mockExecAsync).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS quadrinhos'),
      );
      expect(db).toBe(mockDb);
    });

    it('should include all expected columns in CREATE TABLE', async () => {
      mockExecAsync.mockResolvedValue(undefined);

      await initializeDatabase();

      const sql = mockExecAsync.mock.calls[0][0] as string;
      expect(sql).toContain('id INTEGER PRIMARY KEY AUTOINCREMENT');
      expect(sql).toContain('titulo TEXT NOT NULL');
      expect(sql).toContain('autor TEXT NOT NULL');
      expect(sql).toContain('editora TEXT NOT NULL');
      expect(sql).toContain('anoPublicacao INTEGER NOT NULL');
      expect(sql).toContain('descricao TEXT');
      expect(sql).toContain('dataCriacao TEXT NOT NULL');
    });

    it('should throw when execAsync fails', async () => {
      mockExecAsync.mockRejectedValue(new Error('SQL Error'));

      await expect(initializeDatabase()).rejects.toThrow('SQL Error');
    });

    it('should throw when openDatabaseAsync fails', async () => {
      mockOpenDatabaseAsync.mockRejectedValue(new Error('Open failed'));

      await expect(initializeDatabase()).rejects.toThrow('Open failed');
    });
  });

  describe('getDatabase', () => {
    it('should open the database and return it', async () => {
      const db = await getDatabase();

      expect(mockOpenDatabaseAsync).toHaveBeenCalledWith('quadrinhos.db');
      expect(db).toBe(mockDb);
    });
  });
});
