import { useState } from 'react';

const RecordDetails = ({ recordDetails }) => {
    if (!recordDetails) {
        return null;  // Return nothing if recordDetails is null or undefined
    }

    return (
        <div className="card mt-4 shadow-lg" style={{ maxWidth: '800px', margin: 'auto' }}>
            <div className="card-header bg-primary text-white">
                <h3>{`${recordDetails.Forename} ${recordDetails.Surname}`}</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <p><strong>Rank:</strong> {recordDetails.Rank}</p>
                        <p><strong>Unit:</strong> {recordDetails.Unit}</p>
                        <p><strong>Conflict:</strong> {recordDetails.Conflicts}</p>
                        <p><strong>Awards:</strong> {recordDetails.HonoursAwards}</p>
                        <p><strong>Service Branch:</strong> {recordDetails.ForceServiceBranch}</p>
                    </div>
                    <div className="col-md-6">
                        <p><strong>Date of Death:</strong> {recordDetails.DoD}</p>
                        <p><strong>Service Number:</strong> {recordDetails.ServiceNumber}</p>
                        <p><strong>Grave Reference:</strong> {recordDetails.GraveRefLot}</p>
                        <p><strong>Additional Info:</strong> {recordDetails.Description}</p>
                    </div>
                </div>
                {recordDetails.Photo && (
                    <div className="mt-4 d-flex justify-content-center">
                        <img
                            src={recordDetails.Photo}
                            alt={`Grave of ${recordDetails.Forename} ${recordDetails.Surname}`}
                            className="img-fluid rounded"
                            style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'cover' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecordDetails;