// ReportContext.js
import React, { createContext, useContext, useState } from 'react';

const ReportContext = createContext();

export const useReport = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
    const [reportData, setReportData] = useState(null);

    return (
        <ReportContext.Provider value={{ reportData, setReportData }}>
            {children}
        </ReportContext.Provider>
    );
};
