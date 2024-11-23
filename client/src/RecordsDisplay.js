import { useState } from 'react';
import RecordDetails from './RecordDetails';
import 'bootstrap/dist/css/bootstrap.min.css';  // Ensure Bootstrap is available

const RecordsDisplay = ({ results }) => {
    const [selectedIds, setSelectedIds] = useState([]); // List of selected record IDs
    const [recordsDetails, setRecordsDetails] = useState([]); // List of selected record details
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

    const handleCheckboxChange = (id) => {
        setSelectedIds(prevSelectedIds =>
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter(selectedId => selectedId !== id)
                : [...prevSelectedIds, id]
        );
    };

    const fetchRecordDetails = async (ids) => {
        setLoadingDetails(true);
        setDetailsError(null);

        try {
            const cleanedIds = ids.map(id => id.replace('burial_', ''));

            // For a single record, fetch the details
            if (cleanedIds.length === 1) {
                const response = await fetch(`http://localhost:8081/api/record/${cleanedIds[0]}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch details for the selected record');
                }
                const data = await response.json();
                console.log(data);
                setRecordsDetails([data]); // Store the single record's details in the list
            } else {
                // For multiple records, fetch bulk details
                const response = await fetch(`http://localhost:8081/api/bulk-get/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ids: cleanedIds }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bulk details');
                }

                const data = await response.json();
                setRecordsDetails(data.Responses.Cemetery);
            }
        } catch (error) {
            setDetailsError(`Error fetching details: ${error.message}`);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleFetchDetails = () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one record.");
            return;
        }
        fetchRecordDetails(selectedIds); // Fetch details based on selected IDs
    };

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Found Records:</h3>

            {/* Check if results are valid before rendering */}
            {results && results.length > 0 ? (
                <ul className="list-group">
                    {results.map((result, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <input
                                type="checkbox"
                                id={`checkbox-${result.document.id}`}
                                checked={selectedIds.includes(result.document.id)}
                                onChange={() => handleCheckboxChange(result.document.id)}
                                className="me-3"
                            />
                            {result.document.forename} {result.document.surname}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found</p>
            )}

            {/* Button for fetching details */}
            {selectedIds.length > 0 && (
                <div className="mt-3">
                    <button
                        onClick={handleFetchDetails}
                        className="btn btn-primary"
                    >
                        {selectedIds.length === 1 ? 'View Details' : 'Fetch Bulk Details'}
                    </button>
                </div>
            )}

            {/* Display the selected record details */}
            {recordsDetails.length > 0 && !loadingDetails && (
                <div className="mt-4">
                    <h3>Record Details:</h3>

                    {/* Map through the selected records and render the details for each */}
                    {recordsDetails.map((record, index) => (
                        <RecordDetails key={index} recordDetails={record} />
                    ))}
                </div>
            )}

            {/* Loading and error messages */}
            {loadingDetails && <div className="alert alert-info">Loading details...</div>}
            {detailsError && <div className="alert alert-danger">{detailsError}</div>}
        </div>
    );
};

export default RecordsDisplay;
