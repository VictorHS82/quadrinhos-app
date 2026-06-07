import { useState, useEffect } from 'react';
import { Quadrinho } from '@/types/Quadrinho';
import { quadrinhoService } from '@/services/QuadrinhoService';
import { showError } from '@/utils/alerts';

interface UseQuadrinhoResult {
  quadrinho: Quadrinho | null;
  loading: boolean;
}

export function useQuadrinho(id: string | undefined): UseQuadrinhoResult {
  const [quadrinho, setQuadrinho] = useState<Quadrinho | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const result = await quadrinhoService.getQuadrinhoById(parseInt(id!));
        if (!cancelled) {
          setQuadrinho(result);
        }
      } catch {
        if (!cancelled) {
          showError('Não foi possível carregar o quadrinho');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { quadrinho, loading };
}
