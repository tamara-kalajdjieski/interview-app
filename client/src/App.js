import { useState } from 'react';
import './App.css';

// Importing Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './SearchBar';
import RecordsDisplay from './RecordsDisplay';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResultsMessage, setNoResultsMessage] = useState('');

  return (
    <div className="container mt-4">
      {/* Header */}
      <h1 className="text-center mb-4">Search Memorial Records</h1>

      {/* Search Bar Component */}
      <SearchBar
        onSearch={setResults}
        setLoading={setLoading}
        setError={setError}
        setNoResultsMessage={setNoResultsMessage}
      />

      {/* Loading State */}
      {loading && <div className="alert alert-info">Loading...</div>}

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* No Results Message */}
      {noResultsMessage && <div className="alert alert-warning">{noResultsMessage}</div>}

      {/* Records Display Section */}
      <div>
        <RecordsDisplay results={results} noResultsMessage={noResultsMessage} />
      </div>
    </div>
  );
}

export default App;
