const Results = ({ displayedMessage, previousGame }) => {
  return (
    <div className="results">
      <div className="results-message">
        <h2>{displayedMessage}</h2>
        <p className="previous-results">{previousGame}</p>
      </div>
    </div>
  );
};

export default Results;
