import { useEffect, useState } from 'react';

const useFetch = (fetchURL) => {
  const [games, setGames] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(fetchURL)
      .then((res) => {
        if (!res.ok) throw Error("Couldn't fetch data from that resource.");
        return res.json();
      })
      .then(({ games }) => {
        setGames([...games]);
        setIsPending(false);
        setError(null);
      }) // If there is an error, set the error state to the error message
      .catch((err) => {
        setIsPending(false);
        setError(err.message);
      });
  }, [fetchURL]);

  return { isPending, error, games };
};

export default useFetch;
