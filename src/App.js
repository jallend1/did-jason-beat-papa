// TODO: Add transition from loading message to game result display
// TODO: Easy way to figure out streaks with Chess dot com API?
// TODO: Literally ANY kind of error handling.
// TODO: Preload videos during that waiting-for-dramatic-effect window
// TODO: Consolidate all date functions -- Use state?
// TODO: Early in month, array will be too short

import { useEffect, useState } from 'react';
import BackgroundVideo from './Components/BackgroundVideo';
import Results from './Components/Results';
import useFetch from './useFetch';

const resultStates = {
  win: '🎉 Yes. 🎉',
  loss: 'No.',
  draw: 'It was a tie :(',
  pending: 'Not Yet.',
  loading: 'And the verdict is...'
};

function App() {
  const fetchURL = 'https://api.chess.com/pub/player/jallend1/games';
  const { games: activeGames } = useFetch(fetchURL);
  const [gameResults, setGameResults] = useState('loading');
  const [displayedMessage, setDisplayedMessage] = useState(
    resultStates.loading
  );
  const [gameCode, setGameCode] = useState('loading');
  const [previousGame, setPreviousGame] = useState(null);

  const isTodaysGame = (game) => {
    const gameEndDate = new Date(game.end_time * 1000).getDate();
    const todaysDate = new Date().getDate();
    return gameEndDate === todaysDate;
  };

  const formatCurrentMonth = (currentDate) => {
    // Ensures month is in two digit format endpoint requires
    let currentMonth = currentDate.getMonth() + 1;
    if (currentMonth < 10) currentMonth = '0' + currentMonth;
    return currentMonth;
  };

  // TODO: Apply this function to archive games as well
  const checkIsPapaOpponent = (game) => {
    const papaURL = 'https://api.chess.com/pub/player/dchessmeister1';
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
        setGameCode('pending');
        if (gameArchive) setPreviousGame(gameArchive[gameArchive.length - 1]);
      }
    } else if (gameArchive) {
      const mostRecentGame = gameArchive[gameArchive.length - 1];
      setPreviousGame(getJasonsResults(gameArchive[gameArchive.length - 2]));
      if (isTodaysGame(mostRecentGame)) {
        // If the most recent game was played today, display the results
        setGameCode(getJasonsResults(mostRecentGame));
      } else {
        // If the most recent game ended on a date that is not today, set status to pending
        setGameCode('pending');
      }
    }
  };

  const getJasonsResults = (game) => {
    return game.black.username === 'jallend1'
      ? game.black.result
      : game.white.result;
  };

  const displayGameOutcome = () => {
    setDisplayedMessage(resultStates[gameResults]);
    setTimeout(() => {
      setGameResults(translateGameResult(gameCode));
    }, '3000');
  };

  const translateGameResult = (gameCode) => {
    if (
      gameCode === 'agree' ||
      gameCode === 'stalemate' ||
      gameCode === 'repetition' ||
      gameCode === 'insufficient'
    )
      return 'draw';
    else if (gameCode === 'checkmated') return 'loss';
    else return gameCode;
  };

  const getDateInfo = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = formatCurrentMonth(currentDate);
    return [currentYear, currentMonth];
  };

  const [currentYear, currentMonth] = getDateInfo();
  const { games: gameArchive } = useFetch(
    fetchURL + `/${currentYear}/${currentMonth}`
  );

  // TODO: Universalize the fetch to allow for any month/year
  // const fetchArchive = (year, month) => {
  //   if (games.length < 15) {
  //     fetch(fetchURL + `/2022/07`)
  //       .then((res) => res.json())
  //       .then((previousGames) => {
  //         setGameArchive([...games, ...previousGames.games]);
  //       });
  //   }
  // };

  useEffect(checkActiveGameOpponent, [activeGames, gameArchive, previousGame]);
  useEffect(displayGameOutcome, [gameResults, gameCode]);

  return (
    <div className="App">
      <div className="wrapper">
        <header className="status-header">
          <h1> Did Jason beat Papa today?</h1>
        </header>
        <BackgroundVideo gameResults={gameResults} />
        <Results
          displayedMessage={displayedMessage}
          previousGame={previousGame}
          gameResults={gameResults}
        />
      </div>
    </div>
  );
}

export default App;
