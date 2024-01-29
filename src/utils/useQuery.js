import fetcher from "./fetcher";
import useSWR from "swr";

const useQuery = (url, noSuspense = false) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    suspense: !noSuspense,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useQuery;
