import 'bootstrap/dist/css/bootstrap.min.css'; 

const SearchBar = ({ onSearch, setLoading, setError, setNoResultsMessage }) => {
  const [input, setInput] = useState('');
  const [queryBy, setQueryBy] = useState('name');
  const [filterBy, setFilterBy] = useState('');
  const [sortBy, setSortBy] = useState('notable:desc');
  const [perPage] = useState(50);
  const [page] = useState(1);

  const handleSearch = async () => {
    const payload = {
      query_by: queryBy,
      filter_by: filterBy,
      input: input.trim(),
      sort_by: sortBy,
      per_page: perPage,
      page: page,
    };

    try {
      setLoading(true);
      setError(null);
      setNoResultsMessage("");

      const response = await fetch('http://localhost:8081/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      console.log(data);
      if (data) {
        onSearch(data.hits); 
      } else {
        onSearch([]);
        setNoResultsMessage('No results found.');
      }
    } catch (error) {
      setError(`Request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* Centered Search Input */}
      <div className="row justify-content-center">
        <div className="col-md-3"> {/* Medium-sized input */}
          <input
            type="text"
            className="form-control" // Default form-control (medium size)
            placeholder="Enter search text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* Filters and Sort By */}
      <div className="row justify-content-center mt-3">
        <div className="col-md-3">
          <label>Query By</label>
          <select
            className="form-select"
            value={queryBy}
            onChange={(e) => setQueryBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="forename">Forename</option>
            <option value="surname">Surname</option>
            <option value="notable">Notable</option>
          </select>
        </div>

        <div className="col-md-3">
          <label>Filter By</label>
          <select
            className="form-select"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="">No Filter</option>
            <option value="notable:true">Notable</option>
            <option value="active:true">Active</option>
          </select>
        </div>

        <div className="col-md-3">
          <label>Sort By</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="notable:asc">Asc</option>
            <option value="notable:desc">Desc</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          style={{ cursor: 'pointer' }}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
