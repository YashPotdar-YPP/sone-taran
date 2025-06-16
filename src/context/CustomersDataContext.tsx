import { createContext, useState, useCallback, ReactNode } from 'react';
import { customer } from '../features/customers/models/Customers';
import apiService, { Customer, EditCustomer } from '../services/apiService';

interface CustomerDataContextProps {
  data: customer[];
  loading: boolean;
  error: Error | null;
  fetchData: () => void;
  invalidateCache: () => void;
  addCustomerData: (newCustomer: Customer) => Promise<any>;
  updateCustomer: (_id: string, editCustomer: EditCustomer) => void;
  deleteCustomer: (_id: string) => void;
  searchCustomer: (name: string, contact: string[]) => Promise<any>;
}

const CustomerDataContext = createContext<CustomerDataContextProps | undefined>(
  undefined
);

export const CustomerDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<customer[]>([]);
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

  const addCustomerData = useCallback(
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

  const updateCustomer = useCallback(
    async (_id: string, editCustomer: EditCustomer) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.updateCustomer(_id, editCustomer);
        await fetchData();
      } catch (err) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const deleteCustomer = useCallback(
    async (_id: string) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.deleteCustomer(_id);
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

  const searchCustomer = useCallback(
    async (name: string, contact: string[]) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.searchCustomer(name, contact);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  return (
    <CustomerDataContext.Provider
      value={{
        data,
        loading,
        error,
        fetchData,
        invalidateCache,
        addCustomerData,
        updateCustomer,
        deleteCustomer,
        searchCustomer,
      }}
    >
      {children}
    </CustomerDataContext.Provider>
  );
};

export { CustomerDataContext };
