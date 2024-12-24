import { useState } from "react";

function useSearch(searchFunction) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(query) {
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchFunction(query);
      setData(results);
    } catch (err) {
      console.error("Error searching:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, handleSearch };
}

export default useSearch;
