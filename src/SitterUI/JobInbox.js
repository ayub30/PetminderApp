import React, { useState, useEffect } from 'react';
import '../AdminUI/AdminUI.css';
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from '../firebase'; 
import InboxCard from '../InboxCard';

export default function JobInbox() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchApprovedBookings = async () => {
            const q = query(collection(db, "bookings"), where("ButtonPress", "==", true), where("Decided", "==", false));
            try {
                const querySnapshot = await getDocs(q);
                const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Fetched Bookings:', bookingsData);  // Log the fetched bookings data
                setBookings(bookingsData);
            } catch (error) {
                console.error("Error fetching approved bookings: ", error);
            }
        };

        fetchApprovedBookings();
    }, []);

    const handleDecide = async (bookingId) => {
        console.log('Deciding on booking ID:', bookingId);  // Log the booking ID being decided on
        const bookingRef = doc(db, "bookings", bookingId);
        try {
            await updateDoc(bookingRef, {
                Decided: true
            });
            console.log('Booking decided:', bookingId);  // Log the successful decision
            // Filter out the booking from UI after updating
            setBookings(prev => prev.filter(booking => booking.id !== bookingId));
        } catch (error) {
            console.error("Error updating booking decision: ", error);
        }
    };

    return (
        <div className="big-con">
            <div className="col1">
                <h1>Job Inbox</h1>
                <div className="inbox">
                    {bookings.map((booking) => (
                        <InboxCard
                            key={booking.id}
                            CardType="Job"
                            Description={`${booking.userName} has a booking with ${booking.sitterName}`}
                            onApprove={() => handleDecide(booking.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
