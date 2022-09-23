import { useState, useEffect } from 'react';
const YesterdaysResults = ({ previousGame, gameResults, previousGameURL }) => {
  const [yesterdaysMessage, setYesterdaysMessage] = useState(null);
  useEffect(() => {
    const handleWinToday = () => {
      if (previousGame === 'win')
        return (
          <p>
            Jason also won <a href={previousGameURL}>yesterday</a>, so he's
            gonna start painting chess pieces on his car like Papa does
            bicycles.
          </p>
        );
      else if (previousGame === 'loss')
        return (
          <p>
            This is one small step in healing the wounds from{' '}
            <a href={previousGameURL}>yesterday's</a> defeat.
          </p>
        );
      else if (previousGame === 'draw')
        return (
          <p>
            This undoes a little of the shame from{' '}
            <a href={previousGameURL}>yesterday's</a> draw.
          </p>
        );
    };

    const handleLossToday = () => {
      if (previousGame === 'win')
        return (
          <p>
            But Jason DID win <a href={previousGameURL}>yesterday</a>, so he's
            finding some small comfort in that.
          </p>
        );
      else if (previousGame === 'loss')
        return (
          <p>
            Jason also lost <a href={previousGameURL}>yesterday</a>, so he's in
            a dark place. Send him your love.
          </p>
        );
      else if (previousGame === 'draw')
        return (
          <p>
            And <a href={previousGameURL}>yesterday</a> was a draw, so things
            are not going great right now for Jason.
          </p>
        );
    };

    const handleDrawToday = () => {
      if (previousGame === 'win')
        return (
          <p>
            He's clinging to the happy memories from{' '}
            <a href={previousGameURL}>yesterday's</a> victory.
          </p>
        );
      else if (previousGame === 'loss')
        return (
          <p>
            Coupled with <a href={previousGameURL}>yesterday's</a> loss, Jason
            is working through some difficult feelings.
          </p>
        );
      else if (previousGame === 'draw')
        return (
          <p>
            It was also a tie game <a href={previousGameURL}>yesterday</a>, so
            hopefully you never see this message.
          </p>
        );
    };

    const handlePendingToday = () => {
      if (previousGame === 'win')
        return (
          <p>
            Jason won <a href={previousGameURL}>yesterday</a>, so we're taking
            that as promising evidence God will be on his side today.
          </p>
        );
      else if (previousGame === 'loss')
        return (
          <p>
            Jason lost <a href={previousGameURL}>yesterday</a>, so he is today
            seeking to restore honor to The House of Allen.
          </p>
        );
      else if (previousGame === 'draw')
        return (
          <p>
            Jason and Papa tied <a href={previousGameURL}>yesterday</a>, which
            inspires very similar feelings as a Jason loss.
          </p>
        );
    };

    if (gameResults === 'win') setYesterdaysMessage(handleWinToday());
    else if (gameResults === 'loss') setYesterdaysMessage(handleLossToday());
    else if (gameResults === 'draw') setYesterdaysMessage(handleDrawToday());
    else if (gameResults === 'pending')
      setYesterdaysMessage(handlePendingToday());
  }, [gameResults, previousGame, previousGameURL]);

  return <div className="previous-results">{yesterdaysMessage}</div>;
};

export default YesterdaysResults;
