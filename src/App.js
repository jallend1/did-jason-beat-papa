// TODO: Easy way to figure out streaks with Chess dot com API?
// TODO: Preload videos during that waiting-for-dramatic-effect window
// TODO: Render an error screen if the fetch fails with link to chess dot com profile

import { useEffect, useState } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import useFetch from "./useFetch";

import Header from "./Components/Header";
import BackgroundVideo from "./Components/BackgroundVideo";
import Results from "./Components/Results";

const resultStates = {
  win: "🎉 Yes. 🎉",
  loss: "No.",
  draw: "It was a tie :(",
  pending: "Not Yet.",
  loading: "And the verdict is...",
  error: "Something is broken :(",
};

function App() {
  const fetchURL = "https://api.chess.com/pub/player/jallend1/games";
  const { games: activeGames, error: activeFetchError } = useFetch(fetchURL);

  const [gameResults, setGameResults] = useState("loading");
  const [displayedMessage, setDisplayedMessage] = useState(
    resultStates.loading
  );
  const [gameCode, setGameCode] = useState("loading");
  const [previousGame, setPreviousGame] = useState(null);

  // **************** //
  //  Date Functions  //
  // **************** //
  const isTodaysGame = (game) => {
    const gameEndDate = new Date(game.end_time * 1000).getDate();
    const gameEndMonth = new Date(game.end_time * 1000).getMonth() + 1;
    const todaysDate = new Date().getDate();
    const todaysMonth = new Date().getMonth() + 1;
    return gameEndDate === todaysDate && gameEndMonth === todaysMonth;
  };

  const formatMonth = (month) => {
    return month < 10 ? (month = "0" + month) : month;
  };

  const getDateInfo = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const currentMonth = formatMonth(currentDate.getMonth() + 1);
    return [currentYear, currentMonth, currentDay];
  };

  const [currentYear, currentMonth, currentDay] = getDateInfo();

  const calculateSecondFetchURL = () => {
    if (currentDay < 3) return null;
    // If it's the first two days of the month, we need to fetch the previous month's games
    else {
      let previousGameYear = currentYear;
      let previousGameMonth = currentMonth - 1;
      if (previousGameMonth < 0) {
        previousGameMonth = 12;
        previousGameYear = currentYear - 1;
      }
      previousGameMonth = formatMonth(previousGameMonth);
      return `https://api.chess.com/pub/player/jallend1/games/${previousGameYear}/${previousGameMonth}`;
    }
  };

  // **************** //
  //  Fetch Archive  //
  // **************** //

  const secondFetchURL = calculateSecondFetchURL();
  const { games: gameArchive, error: archiveFetchError } = useFetch(
    fetchURL + `/${currentYear}/${currentMonth}`,
    secondFetchURL
  );

  const checkIsPapaOpponent = (game) => {
    const papaURL = "https://api.chess.com/pub/player/dchessmeister1";
    if (Object.values(game.black).includes(papaURL)) return true;
    else if (Object.values(game.white).includes(papaURL)) return true;
    // If active game, opponent URL is stored at top level
    else if (Object.values(game).includes(papaURL)) return true;
    else return false;
  };

  const checkActiveGameOpponent = () => {
    if (activeGames && activeGames.length > 0) {
      if (
        activeGames.filter((activeGame) => checkIsPapaOpponent(activeGame))
          .length > 0
      ) {
        setGameCode("pending");
        if (gameArchive) {
          const papaGames = gameArchive.filter((game) =>
            checkIsPapaOpponent(game)
          );
          const mostRecentPapaGame = papaGames[papaGames.length - 1];
          const translatedResults = translateGameResult(
            getJasonsResults(mostRecentPapaGame)
          );
          setPreviousGame(translatedResults);
        }
      }
    } else if (gameArchive && gameArchive.length > 0) {
      const filteredPapaGames = gameArchive.filter((game) =>
        checkIsPapaOpponent(game)
      );
      const mostRecentGame = filteredPapaGames[filteredPapaGames.length - 1];
      setPreviousGame(
        translateGameResult(
          getJasonsResults(gameArchive[gameArchive.length - 2])
        )
      );
      if (isTodaysGame(mostRecentGame)) {
        // If the most recent game was played today, display the results
        setGameCode(getJasonsResults(mostRecentGame));
      } else {
        // If the most recent game ended on a date that is not today, set status to pending
        setGameCode("pending");
      }
    }
  };

  const getJasonsResults = (game) => {
    return game.black.username === "jallend1"
      ? game.black.result
      : game.white.result;
  };

  const displayGameOutcome = () => {
    setDisplayedMessage(resultStates[gameResults]);
    setTimeout(() => {
      setGameResults(translateGameResult(gameCode));
    }, "3000");
  };

  const translateGameResult = (gameCode) => {
    if (
      gameCode === "agree" ||
      gameCode === "stalemate" ||
      gameCode === "repetition" ||
      gameCode === "insufficient"
    )
      return "draw";
    else if (gameCode === "checkmated" || gameCode === "resigned")
      return "loss";
    else return gameCode;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(checkActiveGameOpponent, [activeGames, gameArchive, previousGame]);
  useEffect(displayGameOutcome, [gameResults, gameCode]);
  useEffect(() => {
    if (activeFetchError && archiveFetchError) {
      setGameResults("error");
    }
  }, [activeFetchError, archiveFetchError]);

  return (
    <div className="App">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="wrapper">
          <Header />
          <BackgroundVideo gameResults={gameResults} />
          <Results
            displayedMessage={displayedMessage}
            previousGame={previousGame}
            gameResults={gameResults}
          />
        </div>
      </PullToRefresh>
    </div>
  );
}

export default App;
