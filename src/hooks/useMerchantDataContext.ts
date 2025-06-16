import { useContext } from "react";
import { MerchantDataContext } from "../context/MerchantDataContext";

const useKalamsDataContext = () => {
  const context = useContext(MerchantDataContext);

  if (!context) {
    throw new Error(
      "useMerchantDataContext must be used within a MerchantDataProvider"
    );
  }

  return context;
};

export default useKalamsDataContext;
