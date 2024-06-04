import React, { useState, useEffect } from "react";
import { doc, addDoc, collection, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; 
import { useAuthState } from "react-firebase-hooks/auth";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Report() {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [user] = useAuthState(auth);
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        if (user) {
            const fetchUserName = async () => {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setFullName(userDoc.data().FullName || 'Anonymous'); // Use 'Anonymous' as fallback
                } else {
                    console.error("No user profile found in Firestore");
                }
            };
            fetchUserName();
        }
    }, [user]);

    const StoreReport = (e) => {
        e.preventDefault();

        if (!user) {
          alert('You must be logged in to submit a report.');
          return;
        }

        addDoc(collection(db, 'reports'), {
            Subject: subject,
            Description: description,
            UserID: user.uid,
            ReportUser: fullName,
            Timestamp: new Date(),
            Reviewed: false,
        }).then(() => {
            alert('Report submitted');
            setDescription('');
            setSubject('');
        }).catch((error) => {
            console.error("Error submitting report: ", error);
            alert("Failed to submit report.");
        });
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <Typography variant="h5" component="h2" marginBottom={2}>
                    Write Report
                </Typography>
                <form onSubmit={StoreReport} style={{ width: '100%' }}>
                    <TextField 
                      label="Subject"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <TextField
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      margin="normal"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Submit Report
                    </Button>
                </form>
            </Box>
        </Container>
    );
}
