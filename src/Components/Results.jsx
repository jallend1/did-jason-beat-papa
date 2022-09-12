import { useState, useEffect } from 'react';

const Results = ({ displayedMessage, previousGame, gameResults }) => {
  const [yesterdaysMessage, setYesterdaysMessage] = useState(null);

  useEffect(() => {
    const handleWinToday = () => {
      if (previousGame === 'win') return 'Jason also won yesterday!';
      else if (previousGame === 'loss')
        return "This helps heal him from yesterday's loss.";
      else if (previousGame === 'draw')
        return "This undoes a little of the shame from yesterday's draw.";
    };

    const handleLossToday = () => {
      if (previousGame === 'win')
        return 'But Jason won yesterday, so things could be worse.';
      else if (previousGame === 'loss')
        return "Jason also lost yesterday, so he's in a dark place";
      else if (previousGame === 'draw')
        return 'And yesterday was a draw, so things are not going great right now for Jason.';
    };

    const handleDrawToday = () => {
      if (previousGame === 'win')
        return "Helps heal the wounds from yesterday's tie game.";
      else if (previousGame === 'loss')
        return "Coupled with yesterday's loss, Jason is working through some difficult feelings.";
      else if (previousGame === 'draw')
        return 'It was also a tie game yesterday, so hopefully you never see this message.';
    };

    const handlePendingToday = () => {
      if (previousGame === 'win')
        return 'Jason won yesterday, so he is hoping to build some momentum.';
      else if (previousGame === 'loss')
        return 'Jason lost yesterday, so he is hoping to bounce back.';
      else if (previousGame === 'draw')
        return 'Jason tied yesterday, so he is hoping to get back in the win column.';
    };

    if (gameResults === 'win') setYesterdaysMessage(handleWinToday());
    else if (gameResults === 'loss') setYesterdaysMessage(handleLossToday());
    else if (gameResults === 'draw') setYesterdaysMessage(handleDrawToday());
    else if (gameResults === 'pending')
      setYesterdaysMessage(handlePendingToday());
  }, [gameResults, previousGame]);

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
