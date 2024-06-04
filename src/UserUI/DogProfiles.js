import React, { useState, useEffect } from "react";
import "./dogProfiles.css";
import Card from "./profile.jsx";
import Button from '@mui/material/Button';
import Form from "./form.js";
import { doc, getDocs, collection, addDoc, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function DogProfiles() {
    const [user] = useAuthState(auth);
    const [profiles, setProfiles] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
  
    // Function to fetch profiles
    const fetchProfiles = async () => {
        if (user) {
            const profilesQuery = query(
                collection(db, "dogProfiles"),
                where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(profilesQuery);
            const fetchedProfiles = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProfiles(fetchedProfiles);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [user]);

    // Function to close the form
    const closeForm = () => {
        setIsFormOpen(false);
    };

    // Function to add a profile
    const addProfile = (newProfile) => {
        setProfiles([...profiles, newProfile]);
    };

    return (
        <div className="container">
            <div className="cards">
                {profiles.map((profile) => (
                    <Card 
                        key={profile.id} 
                        Dogname={profile.dogName} 
                        Dogdescription={profile.dogDescription} 
                        DogImage={profile.dogImage} 
                    />
                ))}
            </div>
            {isFormOpen ? (
                <div className="modal">
                    <div className="form-con">
                        <Form onAddProfile={addProfile} onClose={closeForm} />
                    </div>
                </div>
            ) : (
                <div className="button">
                    <Button variant='contained' onClick={() => setIsFormOpen(true)}>Add Profile</Button>
                </div>
            )}
        </div>
    );
}
