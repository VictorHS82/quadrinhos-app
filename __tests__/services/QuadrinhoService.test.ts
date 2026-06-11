import { quadrinhoService } from '../../services/QuadrinhoService';
import { getDatabase } from '../../database/db';

jest.mock('../../database/db');

const mockGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;

const mockRunAsync = jest.fn();
const mockGetAllAsync = jest.fn();
const mockGetFirstAsync = jest.fn();

const mockDb = {
  runAsync: mockRunAsync,
  getAllAsync: mockGetAllAsync,
  getFirstAsync: mockGetFirstAsync,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetDatabase.mockResolvedValue(mockDb as never);
  // Reset internal db state by re-initializing
  (quadrinhoService as unknown as { db: null }).db = null;
});

describe('QuadrinhoService', () => {
  describe('createQuadrinho', () => {
    it('should insert a new quadrinho and return it with id and dataCriacao', async () => {
      mockRunAsync.mockResolvedValue({ lastInsertRowid: 42 });

      const input = {
        titulo: 'Batman: Ano Um',
        autor: 'Frank Miller',
        editora: 'DC Comics',
        anoPublicacao: 1987,
        descricao: 'A origem do Batman',
      };

      const result = await quadrinhoService.createQuadrinho(input);

      expect(mockRunAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO quadrinhos'),
        expect.arrayContaining([
          input.titulo,
          input.autor,
          input.editora,
          input.anoPublicacao,
          input.descricao,
          expect.any(String), // dataCriacao
        ]),
      );
      expect(result.id).toBe(42);
      expect(result.titulo).toBe(input.titulo);
      expect(result.autor).toBe(input.autor);
      expect(result.dataCriacao).toBeDefined();
    });

    it('should throw when db.runAsync fails', async () => {
      mockRunAsync.mockRejectedValue(new Error('DB error'));

      const input = {
        titulo: 'Test',
        autor: 'Author',
        editora: 'Publisher',
        anoPublicacao: 2020,
        descricao: '',
      };

      await expect(quadrinhoService.createQuadrinho(input)).rejects.toThrow('DB error');
    });
  });

  describe('getAllQuadrinhos', () => {
    it('should return all quadrinhos ordered by dataCriacao DESC', async () => {
      const mockData = [
        { id: 2, titulo: 'B', autor: 'A2', editora: 'E2', anoPublicacao: 2022, descricao: '', dataCriacao: '2024-02-01' },
        { id: 1, titulo: 'A', autor: 'A1', editora: 'E1', anoPublicacao: 2021, descricao: '', dataCriacao: '2024-01-01' },
      ];
      mockGetAllAsync.mockResolvedValue(mockData);

      const result = await quadrinhoService.getAllQuadrinhos();

      expect(mockGetAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM quadrinhos ORDER BY dataCriacao DESC'),
      );
      expect(result).toEqual(mockData);
    });

    it('should return empty array when result is null', async () => {
      mockGetAllAsync.mockResolvedValue(null);

      const result = await quadrinhoService.getAllQuadrinhos();

      expect(result).toEqual([]);
    });

    it('should throw when db.getAllAsync fails', async () => {
      mockGetAllAsync.mockRejectedValue(new Error('Query failed'));

      await expect(quadrinhoService.getAllQuadrinhos()).rejects.toThrow('Query failed');
    });
  });

  describe('getQuadrinhoById', () => {
    it('should return a quadrinho when found', async () => {
      const mockQuadrinho = {
        id: 1,
        titulo: 'Watchmen',
        autor: 'Alan Moore',
        editora: 'DC Comics',
        anoPublicacao: 1986,
        descricao: 'Graphic novel',
        dataCriacao: '2024-01-01',
      };
      mockGetFirstAsync.mockResolvedValue(mockQuadrinho);

      const result = await quadrinhoService.getQuadrinhoById(1);

      expect(mockGetFirstAsync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM quadrinhos WHERE id = ?'),
        [1],
      );
      expect(result).toEqual(mockQuadrinho);
    });

    it('should return null when quadrinho not found', async () => {
      mockGetFirstAsync.mockResolvedValue(null);

      const result = await quadrinhoService.getQuadrinhoById(999);

      expect(result).toBeNull();
    });

    it('should throw when db.getFirstAsync fails', async () => {
      mockGetFirstAsync.mockRejectedValue(new Error('Not found'));

      await expect(quadrinhoService.getQuadrinhoById(1)).rejects.toThrow('Not found');
    });
  });

  describe('updateQuadrinho', () => {
    const existingQuadrinho = {
      id: 1,
      titulo: 'Watchmen',
      autor: 'Alan Moore',
      editora: 'DC Comics',
      anoPublicacao: 1986,
      descricao: 'Original',
      dataCriacao: '2024-01-01',
    };

    it('should merge partial input and update the quadrinho', async () => {
      mockGetFirstAsync.mockResolvedValue(existingQuadrinho);
      mockRunAsync.mockResolvedValue({ changes: 1 });

      const result = await quadrinhoService.updateQuadrinho(1, {
        titulo: 'Watchmen (Edição Definitiva)',
        descricao: 'Updated description',
      });

      expect(mockRunAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE quadrinhos SET'),
        expect.arrayContaining([
          'Watchmen (Edição Definitiva)',
          'Alan Moore',
          'DC Comics',
          1986,
          'Updated description',
          1,
        ]),
      );
      expect(result).not.toBeNull();
      expect(result!.titulo).toBe('Watchmen (Edição Definitiva)');
      expect(result!.autor).toBe('Alan Moore');
    });

    it('should return null when quadrinho does not exist', async () => {
      mockGetFirstAsync.mockResolvedValue(null);

      const result = await quadrinhoService.updateQuadrinho(999, { titulo: 'New Title' });

      expect(result).toBeNull();
      expect(mockRunAsync).not.toHaveBeenCalled();
    });

    it('should throw when db.runAsync fails during update', async () => {
      mockGetFirstAsync.mockResolvedValue(existingQuadrinho);
      mockRunAsync.mockRejectedValue(new Error('Update failed'));

      await expect(
        quadrinhoService.updateQuadrinho(1, { titulo: 'New' }),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteQuadrinho', () => {
    it('should return true when quadrinho is deleted', async () => {
      mockRunAsync.mockResolvedValue({ changes: 1 });

      const result = await quadrinhoService.deleteQuadrinho(1);

      expect(mockRunAsync).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM quadrinhos WHERE id = ?'),
        [1],
      );
      expect(result).toBe(true);
    });

    it('should return false when no rows are affected', async () => {
      mockRunAsync.mockResolvedValue({ changes: 0 });

      const result = await quadrinhoService.deleteQuadrinho(999);

      expect(result).toBe(false);
    });

    it('should throw when db.runAsync fails', async () => {
      mockRunAsync.mockRejectedValue(new Error('Delete failed'));

      await expect(quadrinhoService.deleteQuadrinho(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('searchQuadrinhos', () => {
    it('should search by titulo, autor, or editora with LIKE', async () => {
      const mockResults = [
        { id: 1, titulo: 'Batman', autor: 'Frank Miller', editora: 'DC', anoPublicacao: 1987, descricao: '', dataCriacao: '2024-01-01' },
      ];
      mockGetAllAsync.mockResolvedValue(mockResults);

      const result = await quadrinhoService.searchQuadrinhos('Batman');

      expect(mockGetAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('titulo LIKE ?'),
        ['%Batman%', '%Batman%', '%Batman%'],
      );
      expect(result).toEqual(mockResults);
    });

    it('should return empty array when no results found', async () => {
      mockGetAllAsync.mockResolvedValue(null);

      const result = await quadrinhoService.searchQuadrinhos('nonexistent');

      expect(result).toEqual([]);
    });

    it('should throw when db.getAllAsync fails', async () => {
      mockGetAllAsync.mockRejectedValue(new Error('Search failed'));

      await expect(quadrinhoService.searchQuadrinhos('test')).rejects.toThrow('Search failed');
    });
  });

  describe('initializeDb / getDb', () => {
    it('should lazily initialize the database on first call', async () => {
      mockGetAllAsync.mockResolvedValue([]);

      await quadrinhoService.getAllQuadrinhos();
      await quadrinhoService.getAllQuadrinhos();

      // getDatabase called once for lazy init, then cached
      expect(mockGetDatabase).toHaveBeenCalledTimes(1);
    });
  });
});
