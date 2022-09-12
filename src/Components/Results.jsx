import { useState, useEffect } from 'react';

const Results = ({ displayedMessage, previousGame, gameResults }) => {
  const [yesterdaysMessage, setYesterdaysMessage] = useState(null);

  const determineMessage = () => {
    if (gameResults === 'win') {
      if (previousGame === 'win') {
        setYesterdaysMessage('Jason also won yesterday!');
      } else if (previousGame === 'loss') {
        setYesterdaysMessage("This helps heal him from yesterday's loss.");
      } else if (previousGame === 'draw') {
        setYesterdaysMessage(
          "This undoes a little of the shame from yesterday's draw."
        );
      }
    } else if (gameResults === 'loss') {
      if (previousGame === 'win') {
        setYesterdaysMessage(
          'But Jason won yesterday, so things could be worse.'
        );
      } else if (previousGame === 'loss') {
        setYesterdaysMessage(
          "Jason also lost yesterday, so he's in a dark place"
        );
      } else if (previousGame === 'draw') {
        setYesterdaysMessage(
          'And yesterday was a draw, so things are not going great right now for Jason.'
        );
      }
    } else if (gameResults === 'draw') {
      if (previousGame === 'win') {
        setYesterdaysMessage(
          "Helps heal the wounds from yesterday's tie game."
        );
      } else if (previousGame === 'loss') {
        setYesterdaysMessage(
          "Coupled with yesterday's loss, Jason is working through some difficult feelings."
        );
      } else if (previousGame === 'draw') {
        setYesterdaysMessage(
          'It was also a tie game yesterday, so hopefully you never see this message.'
        );
      }
    } else if (gameResults === 'pending') {
      if (previousGame === 'win') {
        setYesterdaysMessage(
          'Jason won yesterday, so he is hoping to build some momentum.'
        );
      } else if (previousGame === 'loss') {
        setYesterdaysMessage(
          'Jason lost yesterday, so he is hoping to bounce back.'
        );
      } else if (previousGame === 'draw') {
        setYesterdaysMessage(
          'Jason tied yesterday, so he is hoping to get back in the win column.'
        );
      }
    }
  };

  useEffect(determineMessage, [gameResults, previousGame]);

  return (
    <div className="results">
      <div className="results-message">
        <h2>{displayedMessage}</h2>
        {gameResults !== 'loading' && (
          <p className="previous-results">{yesterdaysMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Results;
