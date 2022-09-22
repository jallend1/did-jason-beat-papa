import { useState, useEffect } from 'react';
const YesterdaysResults = ({ previousGame, gameResults }) => {
  const [yesterdaysMessage, setYesterdaysMessage] = useState(null);

  useEffect(() => {
    const handleWinToday = () => {
      if (previousGame === 'win')
        return "Jason also won yesterday, so he's gonna start painting chess pieces on his car like Papa does bicycles.";
      else if (previousGame === 'loss')
        return "This is one small step in healing the wounds from yesterday's defeat.";
      else if (previousGame === 'draw')
        return "This undoes a little of the shame from yesterday's draw.";
    };

    const handleLossToday = () => {
      if (previousGame === 'win')
        return "But Jason DID win yesterday, so he's finding some small comfort in that.";
      else if (previousGame === 'loss')
        return "Jason also lost yesterday, so he's in a dark place. Send him your love.";
      else if (previousGame === 'draw')
        return 'And yesterday was a draw, so things are not going great right now for Jason.';
    };

    const handleDrawToday = () => {
      if (previousGame === 'win')
        return "He's clinging to the happy memories from yesterday's victory.";
      else if (previousGame === 'loss')
        return "Coupled with yesterday's loss, Jason is working through some difficult feelings.";
      else if (previousGame === 'draw')
        return 'It was also a tie game yesterday, so hopefully you never see this message.';
    };

    const handlePendingToday = () => {
      if (previousGame === 'win')
        return "Jason won yesterday, so we're taking that as clear evidence God will be on his side today.";
      else if (previousGame === 'loss')
        return 'Jason lost yesterday, so he is today seeking to restore honor to The House of Allen.';
      else if (previousGame === 'draw')
        return 'Jason and Papa tied yesterday, which inspires very similar feelings as a Jason loss.';
    };

    if (gameResults === 'win') setYesterdaysMessage(handleWinToday());
    else if (gameResults === 'loss') setYesterdaysMessage(handleLossToday());
    else if (gameResults === 'draw') setYesterdaysMessage(handleDrawToday());
    else if (gameResults === 'pending')
      setYesterdaysMessage(handlePendingToday());
  }, [gameResults, previousGame]);

  return <p className="previous-results">{yesterdaysMessage}</p>;
};

export default YesterdaysResults;
