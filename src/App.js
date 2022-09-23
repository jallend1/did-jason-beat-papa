// TODO: Easy way to figure out streaks with Chess dot com API?
// TODO: Preload videos during that waiting-for-dramatic-effect window
// TODO: Render an error screen if the fetch fails with link to chess dot com profile
// TODO: I don't remember the distinctdions between gameResult and gameCode -- Fix the naming

import { useEffect, useState, useCallback } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import useFetch from './useFetch';
import dateFunctions, {
  calculatePreviousMonth,
  isTodaysGame
} from './dateFunctions';

import Header from './Components/Header';
import BackgroundVideo from './Components/BackgroundVideo';
import Results from './Components/Results';

const resultStates = {
  win: '🎉 Yes. 🎉',
  loss: 'No.',
  draw: 'It was a tie :(',
  pending: 'Not Yet.',
  loading: 'And the verdict is...',
  error: 'Something is broken :('
};

function App() {
  const fetchURL = 'https://api.chess.com/pub/player/jallend1/games';
  const { games: activeGames, error: activeFetchError } = useFetch(fetchURL);
  const { currentYear, currentMonth, currentDay } = dateFunctions();
  const [activePapaGames, setActivePapaGames] = useState(null);
  const [archivePapaGames, setArchivePapaGames] = useState(null);
  const [gameResults, setGameResults] = useState('loading');
  const [isActiveGame, setIsActiveGame] = useState(null);
  const [gameCode, setGameCode] = useState('loading');
  const [previousGame, setPreviousGame] = useState(null);
  const [previousGameURL, setPreviousGameURL] = useState(null);
  const [displayedMessage, setDisplayedMessage] = useState(
    resultStates.loading
  );

  // **************** //
  //  Fetch Archive  //
  // **************** //

  const calculateSecondFetchURL = () => {
    if (currentDay < 3) {
      const { previousGameMonth, previousGameYear } = calculatePreviousMonth();
      return `https://api.chess.com/pub/player/jallend1/games/${previousGameYear}/${previousGameMonth}`;
    } else {
      return null;
    }
  };

  const secondFetchURL = calculateSecondFetchURL();
  const { games: gameArchive, error: archiveFetchError } = useFetch(
    fetchURL + `/${currentYear}/${currentMonth}`,
    secondFetchURL
  );

  const checkIsPapaOpponent = (game) => {
    const papaURL = 'https://api.chess.com/pub/player/dchessmeister1';
    if (
      Object.values(game.black).includes(papaURL) ||
      Object.values(game.white).includes(papaURL)
    )
      return true;
    // If active game, opponent URL is stored at top level
    else if (Object.values(game).includes(papaURL)) return true;
    else return false;
  };

  const checkActiveGames = () => {
    setIsActiveGame(activePapaGames && activePapaGames.length > 0);
  };

  useEffect(checkActiveGames, [activePapaGames, isActiveGame]);

  const getLatestGameStatus = () => {
    if (isActiveGame) setGameCode('pending');
    else {
      if (archivePapaGames) {
        const mostRecentGame = archivePapaGames[archivePapaGames.length - 1];
        if (isTodaysGame(mostRecentGame)) {
          // If the most recent game was played today, display the results
          setGameCode(getJasonsResults(mostRecentGame));
        } else {
          // If the most recent game ended on a date that is not today, set status to pending
          setGameCode('pending');
        }
      }
    }
  };

  const getJasonsResults = useCallback((game) => {
    return game.black.username === 'jallend1'
      ? translateGameResult(game.black.result)
      : translateGameResult(game.white.result);
  }, []);

  const getPreviousGame = () => {
    if (archivePapaGames) {
      let gamePosition;
      isActiveGame ? (gamePosition = 1) : (gamePosition = 2);
      const previousGame =
        archivePapaGames[archivePapaGames.length - gamePosition];
      const previousGameResult = getJasonsResults(previousGame);

      setPreviousGame(previousGameResult);
      console.log(previousGame.url);
      setPreviousGameURL(previousGame.url);
    }
  };

  useEffect(getLatestGameStatus, [
    isActiveGame,
    archivePapaGames,
    getJasonsResults
  ]);
  useEffect(getPreviousGame, [
    archivePapaGames,
    isActiveGame,
    getJasonsResults
  ]);

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
    else if (gameCode === 'checkmated' || gameCode === 'resigned')
      return 'loss';
    else return gameCode;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const findPapaGames = (gameType) => {
      if (gameType && gameType.length > 0)
        return gameType.filter((game) => checkIsPapaOpponent(game));
    };
    setArchivePapaGames(findPapaGames(gameArchive));
    setActivePapaGames(findPapaGames(activeGames) || []);
  }, [gameArchive, activeGames]);

  useEffect(displayGameOutcome, [gameResults, gameCode]);
  useEffect(() => {
    if (activeFetchError && archiveFetchError) {
      setGameResults('error');
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
            previousGameURL={previousGameURL}
          />
        </div>
      </PullToRefresh>
    </div>
  );
}

export default App;
