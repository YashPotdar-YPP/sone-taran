import { createContext, useState, useCallback, ReactNode } from 'react';
import apiService from '../services/apiService';
import { customer } from '../features/customers/models/Customers';
import { Customer } from '../services/apiService';

interface CustomerDataContextProps {
  data: customer[];
  loading: boolean;
  error: Error | null;
  fetchData: () => void;
  invalidateCache: () => void;
  addData: (newCustomer: Customer) => void;
}

const CustomerDataContext = createContext<CustomerDataContextProps | undefined>(
  undefined
);

export const CustomerDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  const addData = useCallback(
    async (newCustomer: Customer) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.AddCustomerData(newCustomer);
        await fetchData();
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
    <CustomerDataContext.Provider
      value={{ data, loading, error, fetchData, invalidateCache, addData }}
    >
      {children}
    </CustomerDataContext.Provider>
  );
};

export { CustomerDataContext };
