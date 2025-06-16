import useCustomersDataContext from "./useCustomerDataContext";

const useCustomerData = () => {
  const { data, loading, error, fetchData, invalidateCache, addCustomerData, searchCustomer, updateCustomer, deleteCustomer } =
    useCustomersDataContext();

  const fetchIfNeeded = () => {
    if (data.length === 0 && !loading) {
      fetchData();
    }
  };

  return { data, loading, error, fetchIfNeeded, invalidateCache, addCustomerData, searchCustomer, updateCustomer, deleteCustomer };
};

export default useCustomerData;
