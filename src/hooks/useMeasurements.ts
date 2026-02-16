import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MeasurementService from '../services/MeasurementService';
import StorageService from '../services/StorageService';
import { MeasurementEntry, BodyMeasurements } from '../types';

export function useMeasurements() {
  const { user } = useAuth();
  const [history, setHistory] = useState<MeasurementEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Carregar histórico ───────────────────────────────────
  const loadHistory = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await MeasurementService.getHistory(user.uid);
      setHistory(data);
    } catch (err: any) {
      setError('Erro ao carregar histórico');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // ── Carregar automaticamente quando user muda ────────────
  useEffect(() => {
    if (user) loadHistory();
  }, [user, loadHistory]);

  // ── Salvar nova medição (upload fotos + Firestore) ───────
  const saveMeasurement = useCallback(
    async (
      measurements: BodyMeasurements,
      photos: { front: string; side: string }
    ): Promise<MeasurementEntry> => {
      if (!user) throw new Error('Usuário não autenticado');

      setIsLoading(true);
      setError(null);
      try {
        // 1. Upload das fotos para o Storage
        const photoUrls = await StorageService.uploadAnalysisPhotos(user.uid, photos);

        // 2. Salvar medição no Firestore
        const entry = await MeasurementService.saveMeasurement(
          user.uid,
          measurements,
          photoUrls
        );

        // 3. Atualizar estado local
        setHistory((prev) => [...prev, entry]);

        return entry;
      } catch (err: any) {
        setError('Erro ao salvar medição');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  // ── Última medição ───────────────────────────────────────
  const latestMeasurement = history.length > 0 ? history[history.length - 1] : null;

  // ── Medição anterior ─────────────────────────────────────
  const previousMeasurement = history.length > 1 ? history[history.length - 2] : null;

  // ── Calcular mudança entre medições ──────────────────────
  const calculateChange = useCallback(
    (metric: keyof BodyMeasurements): number => {
      if (!latestMeasurement || !previousMeasurement) return 0;
      return latestMeasurement[metric] - previousMeasurement[metric];
    },
    [latestMeasurement, previousMeasurement]
  );

  // ── Filtrar por período ──────────────────────────────────
  const filterByPeriod = useCallback(
    (period: 'week' | 'month' | 'all'): MeasurementEntry[] => {
      const now = new Date();
      return history.filter((entry) => {
        const entryDate = new Date(entry.date);
        const diffDays = Math.floor(
          (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (period) {
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'all':
          default:
            return true;
        }
      });
    },
    [history]
  );

  // ── Deletar medição ──────────────────────────────────────
  const deleteMeasurement = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        await MeasurementService.deleteMeasurement(id);
        setHistory((prev) => prev.filter((m) => m.id !== id));
      } catch (err: any) {
        setError('Erro ao deletar medição');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ── Limpar todos os dados ────────────────────────────────
  const clearAllData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await MeasurementService.deleteAllMeasurements(user.uid);
      await StorageService.deleteAllUserPhotos(user.uid);
      setHistory([]);
    } catch (err: any) {
      setError('Erro ao limpar dados');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // ── Exportar CSV ─────────────────────────────────────────
  const exportCSV = useCallback(async (): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado');
    return MeasurementService.exportAsCSV(user.uid);
  }, [user]);

  return {
    history,
    isLoading,
    error,
    latestMeasurement,
    previousMeasurement,
    measurementCount: history.length,
    loadHistory,
    saveMeasurement,
    deleteMeasurement,
    clearAllData,
    calculateChange,
    filterByPeriod,
    exportCSV,
  };
}
