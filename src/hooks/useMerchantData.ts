import useMerchantDataContext from "./useMerchantDataContext";

const useMerchantData = () => {
  const { data, loading, error, invalidateCache, AddMerchantData, searchMerchant, updateMerchant } =
    useMerchantDataContext();


  return {
    data, loading, error, invalidateCache, AddMerchantData, searchMerchant, updateMerchant
  };
};

export default useMerchantData;
