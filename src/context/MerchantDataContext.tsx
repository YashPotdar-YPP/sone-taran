import { createContext, useState, useCallback, ReactNode } from 'react';
import { merchant } from '../features/merchant/model/Merchant';
import apiService, { EditMerchant, AddMerchant } from '../services/apiService';

interface MerchnatDataContextProps {
  data: merchant[];
  loading: boolean;
  error: Error | null;
  invalidateCache: () => void;
  AddMerchantData: (MerchantData: AddMerchant) => Promise<any>;
  searchMerchant: (name: string, contact: string[]) => Promise<any>;
  updateMerchant: (_id: string, editMerchant: EditMerchant) => void;
}

const MerchantDataContext = createContext<MerchnatDataContextProps | undefined>(
  undefined
);

export const MerchantDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // For customer
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiService.fetchCustomerData();
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

  const AddMerchantData = useCallback(
    async (MerchantData: AddMerchant) => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiService.AddMerchantData(MerchantData);
        return res;
        setLoading(false);
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

  const searchMerchant = useCallback(
    async (name: string, contact: string[]) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.searchMerchant(name, contact);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const updateMerchant = useCallback(
    async (_id: string, editMerchant: EditMerchant) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.updateMerchant(_id, editMerchant);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to add customer')
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );
  return (
    <MerchantDataContext.Provider
      value={{
        data,
        loading,
        error,
        AddMerchantData,
        searchMerchant,
        updateMerchant,
        invalidateCache,
      }}
    >
      {children}
    </MerchantDataContext.Provider>
  );
};

export { MerchantDataContext };
