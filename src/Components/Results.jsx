import YesterdaysResults from './YesterdaysResults';

const Results = ({ displayedMessage, previousGame, gameResults }) => {
  return (
    <div className="results">
      <div className="results-message">
        <h2>{displayedMessage}</h2>
        {gameResults !== 'loading' && (
          <YesterdaysResults
            gameResults={gameResults}
            previousGame={previousGame}
          />
        )}
      </div>
    </div>
  );
};

export default Results;
