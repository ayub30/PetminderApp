import React, {useState, useEffect} from "react";
import "./AdminUI.css"
import InboxCard from "../InboxCard";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminUI(){
    const [bookings, setBookings] = useState([]);
    const [verify,setVerify] = useState([]);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
          try {
            const querySnapshot = await getDocs(query(collection(db, "reports"), where('Reviewed', '==', false)));
            const fetchedReports = querySnapshot.docs.map(doc => {
              return {
                id: doc.id,
                ...doc.data()
              };
            });
            
            setReports(fetchedReports);
            
          } catch (error) {
            console.error("Error fetching reports:", error);
          }
        };
    
        fetchReports();
      }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const fetchedBookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(booking => !booking.ButtonPress);
      setBookings(fetchedBookings);
    };

    fetchBookings();
  }, []);
  
  useEffect(() => {
    const fetchVerification = async () => {

      const verQuery = query(
        collection(db, 'users'),
        where("UserType", "==", "sitter"),
        where("IsVerified", "==", false)
      );
  
      try {
        const verSnapshot = await getDocs(verQuery);
        const fetchedVerification = verSnapshot.docs.map(doc => {
          // Assuming the data includes the fields as shown in the screenshot
          const data = doc.data();
          return {
            id: doc.id,
            fullName: data.FullName, // The name of the sitter
            verificationURL: data.VerificationUrl // The verification URL
          };
        });
  
        // Update the verify state with the fetched verification data
        setVerify(fetchedVerification);
      } catch (error) {
        console.error("Error fetching verification data: ", error);
      }
    };
  
    fetchVerification();
  }, []);

  const handleView = async (reportId, action) => {
    if (action === 'close') { // use 'close' to match the action passed
        const reportRef = doc(db, "reports", reportId);
        try {
            await updateDoc(reportRef, {
                Reviewed: true  // Assuming you want to mark it as reviewed
            });
            // Filter out the report from the current state
            setReports(prev => prev.filter(report => report.id !== reportId));
        } catch (error) {
            console.error("Error updating report: ", error);
        }
    }
};
  



  const handleButton = async (bookingId, action) => {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
        ButtonPress: true  // Set to true to hide the card
    });
    
  

    // Optionally refresh the bookings or filter out this booking
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
};
const handleVerify = async (userId, action) => {
    if (action === 'approve') {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        IsVerified: true  // Set to true to approve the sitter
      });
  
      // Optionally refresh the verifications list
      setVerify(prev => prev.filter(user => user.id !== userId));
    }
    else if (action === 'deny'){
        const userRef = doc(db, "users", userId);
        setVerify(prev => prev.filter(user => user.id !== userId));
    }
    // Handle other actions if necessary
  };
    return(
        <div className="big-con">
            <div className="col1">
                <h1>Admin Inbox</h1>
                <div className="inbox">
                {bookings.map(booking => (
                    <InboxCard
                    key={booking.id}
                    CardType="Booking Request"
                    Description={`${booking.userName} requests ${booking.sitterName} for booking`}
                    onApprove={() => handleButton(booking.id, 'approve')}
                    onDeny={() => handleButton(booking.id, 'deny')}
                    />
                ))}
                
                    {verify.map(ver => (
                    <InboxCard
                        key={ver.id}
                        CardType="Verification Request"
                        Description={`Verification for ${ver.fullName}`} // Pass the sitter's name to the InboxCard
                        VerificationURL={ver.verificationURL} // Pass the verification URL to the InboxCard
                        onApprove={() => handleVerify(ver.id, 'approve')}
                        onDeny={() => handleVerify(ver.id, 'deny')}
                    />
                    ))}

                    {reports.map((report, index) => (
                    <InboxCard
                    key={report.id}
                    CardType={'Report'}
                    Description={`${report.ReportUser} - ${report.Subject}`}
                    Details={report.Description}
                    onApprove={() => handleView(report.id, 'close')} 
                    />))}
                </div>
            </div>
        </div>
    )
}