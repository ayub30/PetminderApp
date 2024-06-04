import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const ReportsList = () => {
    const [reports, setReports] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if the user is an admin
        const auth = getAuth();
        auth.currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                if (!!idTokenResult.claims.isAdmin) {
                    setIsAdmin(true);
                    // Fetch reports from Firestore
                    getDocs(collection(db, "report"))
                        .then((querySnapshot) => {
                            const reportsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                            setReports(reportsData);
                        })
                        .catch(error => {
                            console.error("Error fetching reports:", error);
                        });
                }
            })
            .catch((error) => {
                console.log("Error fetching custom claims", error);
            });
    }, []);

    if (!isAdmin) {
        return <div>Access Denied</div>;
    }

    return (
        <div>
            <h2>Reports</h2>
            {reports.map((report) => (
                <div key={report.id}>
                    <h3>{report.subject}</h3>
                    <p>{report.description}</p>
                </div>
            ))}
        </div>
    );
};