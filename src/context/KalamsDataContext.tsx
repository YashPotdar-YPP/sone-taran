import { createContext, useState, useCallback, ReactNode } from 'react';
import { Kalam } from '../features/kalams/models/Kalam';
import apiService, { AddKalam, EditLoan } from '../services/apiService';
interface KalamsDataContextProps {
  data: Kalam[];
  loading: boolean;
  error: Error | null;
  fetchData: () => void;
  invalidateCache: () => void;
  addData: (newKalam: AddKalam) => void;
  updateLoan: (_id: string, editLoan: EditLoan) => void;
  deleteLoan: (_id: string) => void;
}

const KalamsDataContext = createContext<KalamsDataContextProps | undefined>(
  undefined
);

export const KalamsDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Kalam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiService.fetchKalamsData();
      setData(result);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred'));
      }
      setLoading(false);
    }
  }, []);

  const invalidateCache = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const addData = useCallback(
    async (newKalam: AddKalam) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.AddKalamsData(newKalam);
        await fetchData();
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setLoading(false);
      }
    },
    [fetchData]
  );

  const updateLoan = useCallback(
    async (_id: string, editLoan: EditLoan) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.updateLoan(_id, editLoan);
        await fetchData();
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const deleteLoan = useCallback(
    async (_id: string) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.deleteLoan(_id);
        await fetchData();
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  return (
    <KalamsDataContext.Provider
      value={{
        data,
        loading,
        error,
        fetchData,
        invalidateCache,
        addData,
        updateLoan,
        deleteLoan,
      }}
    >
      {children}
    </KalamsDataContext.Provider>
  );
};

export { KalamsDataContext };
