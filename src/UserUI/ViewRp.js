import React from 'react';
import { useReport } from './ReportContext'; // Import the custom hook from your context file

export default function ViewRp() {
    const { reportData } = useReport(); // Retrieve the report data from context

    if (!reportData) {
        return <div>No report found</div>; // Or redirect, or any other fallback
    }

    return (
        <div>
            <h2>Report Details</h2>
            <p><strong>Subject:</strong> {reportData.subject}</p>
            <p><strong>Description:</strong> {reportData.description}</p>
            {/* Display more data as needed */}
        </div>
    );
}
