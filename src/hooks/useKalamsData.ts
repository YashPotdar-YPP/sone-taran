import useKalamsDataContext from "./useKalamsDataContext";

const useKalamsData = () => {
  const { data, loading, error, fetchData, invalidateCache, addData, updateLoan, deleteLoan } =
    useKalamsDataContext();

  const fetchIfNeeded = () => {
    if (data.length === 0 && !loading) {
      fetchData();
    }
  };

  return { data, loading, error, fetchIfNeeded, invalidateCache, addData, updateLoan, deleteLoan };
};

export default useKalamsData;
