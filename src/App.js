// TODO: Add transition from loading message to game result display
// TODO: If current game active, show yesterday's results
// TODO: Display yesterday's results all the time: "Jason also lost yesterday, etc..."
// TODO: Easy way to figure out streaks with Chess dot com API?
// TODO: Literally ANY kind of error handling.
// TODO: Preload videos during that waiting-for-dramatic-effect window
// TODO: Consolidate all date functions -- Use state?

import { useEffect, useState } from "react";
import BackgroundVideo from "./Components/BackgroundVideo";
import Results from "./Components/Results";

const resultStates = {
  win: "🎉 Yes. 🎉",
  loss: "No.",
  draw: "It was a tie :(",
  pending: "Not Yet.",
  loading: "And the verdict is...",
};

function App() {
  const fetchURL = "https://api.chess.com/pub/player/jallend1/games";
  const [gameResults, setGameResults] = useState("loading");
  const [displayedMessage, setDisplayedMessage] = useState(
    resultStates.loading
  );
  const [activeGames, setActiveGames] = useState(null);
  const [gameArchive, setGameArchive] = useState(null);
  const [gameCode, setGameCode] = useState("loading");
  const [previousGame, setPreviousGame] = useState(null);

  const isTodaysGame = (game) => {
    const gameEndDate = new Date(game.end_time * 1000).getDate();
    const todaysDate = new Date().getDate();
    return gameEndDate === todaysDate;
  };

  const checkActiveGameOpponent = () => {
    // IF there are active games, verifies that one of them DOES indeed involve Papa
    if (activeGames && activeGames.length > 0) {
      // If a Papa game is happening, reflect that in gameCode. If not, reflect Chess Dot Com result
      if (
        activeGames.filter((activeGame) =>
          Object.values(activeGame).includes(
            "https://api.chess.com/pub/player/dchessmeister1"
          )
        ).length > 0
      ) {
        setGameCode("pending");
        if (gameArchive) setPreviousGame(gameArchive[gameArchive.length - 1]);
      }
    } else if (gameArchive) {
      const mostRecentGame = gameArchive[gameArchive.length - 1];
      setPreviousGame(gameArchive[gameArchive.length - 2]);
      console.log(previousGame);
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

  // const didJasonWin = (game) => {
  //   console.log(translateGameResult(getJasonsResults(game)));
  // };

  const translateGameResult = (gameCode) => {
    if (
      gameCode === "agree" ||
      gameCode === "stalemate" ||
      gameCode === "repetition" ||
      gameCode === "insufficient"
    )
      return "draw";
    else if (gameCode === "checkmated") return "loss";
    else return gameCode;
  };

  // Fetches Games and Puts them in State
  useEffect(() => {
    const formatCurrentMonth = (currentDate) => {
      // Ensures month is in two digit format endpoint requires
      let currentMonth = currentDate.getMonth() + 1;
      if (currentMonth < 10) currentMonth = "0" + currentMonth;
      return currentMonth;
    };

    const getDateInfo = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = formatCurrentMonth(currentDate);
      return [currentYear, currentMonth];
    };

    const fetchActiveGames = () => {
      fetch(fetchURL)
        .then((res) => res.json())
        .then(({ games }) => {
          setActiveGames([...games]);
        });
    };

    const fetchArchiveGames = () => {
      const [currentYear, currentMonth] = getDateInfo();
      fetch(fetchURL + `/${currentYear}/${currentMonth}`)
        .then((res) => res.json())
        .then(({ games }) => {
          setGameArchive([...games]);
        });
    };

    fetchActiveGames();
    fetchArchiveGames();
  }, []);

  useEffect(checkActiveGameOpponent, [activeGames, gameArchive, previousGame]);
  useEffect(displayGameOutcome, [gameResults, gameCode]);

  return (
    <div className="App">
      <div className="wrapper">
        <header className="status-header">
          <h1> Did Jason beat Papa today?</h1>
        </header>
        <BackgroundVideo gameResults={gameResults} />
        <Results displayedMessage={displayedMessage} />
      </div>
    </div>
  );
}

export default App;
