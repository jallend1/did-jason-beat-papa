import { useEffect, useState } from 'react';

const useFetch = (fetchURL) => {
  const [games, setGames] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(fetchURL)
      .then((res) => {
        if (!res.ok) throw Error('PROBLEM!');
        return res.json();
      })
      .then(({ games }) => {
        setGames([...games]);
        setIsPending(false);
        setError(null);
      }) // If there is an error, set the error state to the error message
      .catch((err) => {
        setIsPending(false);
        setError(err.message, console.log(err.message));
      });
  }, [fetchURL]);

  //     const fetchActiveGames = () => {
  //       fetch(fetchURL)
  //         .then((res) => res.json())
  //         .then(({ games }) => {
  //           setActiveGames([...games]);
  //         });
  //     };

  //     const fetchArchiveGames = () => {
  //       const [currentYear, currentMonth] = getDateInfo();
  //       fetch(fetchURL + `/${currentYear}/${currentMonth}`)
  //         .then((res) => res.json())
  //         .then(({ games }) => {
  //           setGameArchive([...games]);
  //         });
  //     };

  //     fetchActiveGames();
  //     fetchArchiveGames();
  //   }, []);

  return { isPending, error, games };
};

export default useFetch;
