import { ReactNode } from 'react';
import { KalamsDataProvider } from './KalamsDataContext';
import { CustomerDataProvider } from './CustomersDataContext';
import { AuthProvider } from '../features/auth/AuthContext/AuthProvider';
import { MerchantDataProvider } from './MerchantDataContext';

const ContextsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <KalamsDataProvider>
      <CustomerDataProvider>
        <MerchantDataProvider>
          <AuthProvider>{children}</AuthProvider>
        </MerchantDataProvider>
      </CustomerDataProvider>
    </KalamsDataProvider>
  );
};

export default ContextsProvider;
