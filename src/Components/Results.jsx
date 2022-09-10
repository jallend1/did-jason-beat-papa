const Results = ({ displayedMessage }) => {
  return (
    <div className="results">
      <div className="results-message">
        <h2>{displayedMessage}</h2>
        {/* <p className="previous-results">Yesterday's results will go here.</p> */}
      </div>
    </div>
  );
};

export default Results;
