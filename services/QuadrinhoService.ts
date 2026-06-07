import * as SQLite from 'expo-sqlite';
import { Quadrinho, CreateQuadrinhoInput, UpdateQuadrinhoInput } from '../types/Quadrinho';
import { getDatabase } from '../database/db';

class QuadrinhoService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initializeDb(): Promise<void> {
    try {
      this.db = await getDatabase();
    } catch (error) {
      this.db = null;
      console.error('QuadrinhoService: falha ao inicializar banco de dados:', error);
      throw error;
    }
  }

  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      await this.initializeDb();
    }
    if (!this.db) {
      throw new Error('Banco de dados não está disponível após inicialização');
    }
    return this.db;
  }

  // CREATE
  async createQuadrinho(input: CreateQuadrinhoInput): Promise<Quadrinho> {
    const db = await this.getDb();
    const dataCriacao = new Date().toISOString();

    try {
      const result = await db.runAsync(
        `INSERT INTO quadrinhos (titulo, autor, editora, anoPublicacao, descricao, dataCriacao) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [input.titulo, input.autor, input.editora, input.anoPublicacao, input.descricao, dataCriacao]
      );

      return {
        id: result.lastInsertRowid as number,
        ...input,
        dataCriacao,
      };
    } catch (error) {
      console.error('Erro ao criar quadrinho:', error);
      throw error;
    }
  }

  // READ - Obter todos
  async getAllQuadrinhos(): Promise<Quadrinho[]> {
    const db = await this.getDb();

    try {
      const result = await db.getAllAsync<Quadrinho>(`
        SELECT * FROM quadrinhos ORDER BY dataCriacao DESC
      `);
      return result || [];
    } catch (error) {
      console.error('Erro ao obter quadrinhos:', error);
      throw error;
    }
  }

  // READ - Obter um específico
  async getQuadrinhoById(id: number): Promise<Quadrinho | null> {
    const db = await this.getDb();

    try {
      const result = await db.getFirstAsync<Quadrinho>(
        `SELECT * FROM quadrinhos WHERE id = ?`,
        [id]
      );
      return result || null;
    } catch (error) {
      console.error('Erro ao obter quadrinho:', error);
      throw error;
    }
  }

  // UPDATE
  async updateQuadrinho(id: number, input: UpdateQuadrinhoInput): Promise<Quadrinho | null> {
    const db = await this.getDb();

    try {
      const quad = await this.getQuadrinhoById(id);
      if (!quad) {
        return null;
      }

      const updatedData: Quadrinho = {
        ...quad,
        ...input,
      };

      await db.runAsync(
        `UPDATE quadrinhos SET 
         titulo = ?, autor = ?, editora = ?, anoPublicacao = ?, descricao = ?
         WHERE id = ?`,
        [
          updatedData.titulo,
          updatedData.autor,
          updatedData.editora,
          updatedData.anoPublicacao,
          updatedData.descricao,
          id,
        ]
      );

      return updatedData;
    } catch (error) {
      console.error('Erro ao atualizar quadrinho:', error);
      throw error;
    }
  }

  // DELETE
  async deleteQuadrinho(id: number): Promise<boolean> {
    const db = await this.getDb();

    try {
      const result = await db.runAsync(
        `DELETE FROM quadrinhos WHERE id = ?`,
        [id]
      );
      return result.changes > 0;
    } catch (error) {
      console.error('Erro ao deletar quadrinho:', error);
      throw error;
    }
  }

  // SEARCH
  async searchQuadrinhos(query: string): Promise<Quadrinho[]> {
    const db = await this.getDb();

    try {
      const result = await db.getAllAsync<Quadrinho>(
        `SELECT * FROM quadrinhos WHERE 
         titulo LIKE ? OR autor LIKE ? OR editora LIKE ?
         ORDER BY dataCriacao DESC`,
        [`%${query}%`, `%${query}%`, `%${query}%`]
      );
      return result || [];
    } catch (error) {
      console.error('Erro ao buscar quadrinhos:', error);
      throw error;
    }
  }
}

export const quadrinhoService = new QuadrinhoService();
