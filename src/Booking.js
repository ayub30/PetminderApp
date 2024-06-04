import React from "react";
import Card from './UserUI/profile';
import "./UserUI/dogProfiles.css"
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase"; 
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

export default function Booking(){
    const location = useLocation();
    const { sitter } = location.state || {}; 
    const [user, loading, error] = useAuthState(auth);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    

    const handleBookSitter = async () => {
        console.log("Sitter Data:", sitter);
        console.log("User Data:", user);

        if (!user) {
            console.error("Authentication data is missing");
            return;
        }

        // Check if the sitter data is available
        if (!sitter) {
            console.error("Sitter data is missing");
            return;
        }

        try {
            // Get user document from Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userProfile = userDocSnap.data();
                const userName = userProfile.FullName; // assuming 'fullName' is the field where name is stored

                // Prepare booking data
                const bookingData = {
                    Type: 'Booking Request',
                    userName: userName, 
                    sitterName: sitter.FullName,
                    ButtonPress: false,
                    Decided: false
                };

                // Create a new booking document
                await addDoc(collection(db, "bookings"), bookingData);
                console.log('Booking created successfully');
            } else {
                console.error("No user profile found in Firestore");
            }
        } catch (error) {
            console.error('Error during booking or fetching user data:', error);
        }
    };


    if (!sitter) {
        
        console.error('Sitter data is not available.');
        return <div>No sitter data!</div>;
    }
    return(
        <div className="container">
            <div className="cards">
            <Card Dogname={sitter.FullName} DogImage={sitter.ImageUrl} Dogdescription={sitter.SitterExperience} onBook={handleBookSitter} />
            </div>

        </div>
    )
}