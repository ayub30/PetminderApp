import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // For layout
import Button from '@mui/material/Button';
import manAndDogImage from './mananddog.png';
 // Button component
// import PetsIcon from '@mui/icons-material/Pets'; // Example icon, uncomment as needed
// Import other MUI icons as needed

import './HomePage.css'; // Make sure this path is correct

export default function HomePage() {
    return (
        <div className="homepage">
            {/* Previous sections here */}

            <Box className="features-section" sx={{ p: 5 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Why Choose Us?
                </Typography>
                <Grid container spacing={2} sx={{ justifyContent: 'center', marginTop: '20px' }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            {/* <PetsIcon sx={{ fontSize: 60 }} /> Uncomment and replace with desired icon */}
                            <Typography variant="h6" component="h3" gutterBottom>
                                Trusted Pet Sitters
                            </Typography>
                            <Typography variant="body1">
                                Every sitter is reviewed and approved by our team, ensuring your pet is in safe hands.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            {/* <FavoriteIcon sx={{ fontSize: 60 }} /> */}
                            <Typography variant="h6" component="h3" gutterBottom>
                                Personalized Care
                            </Typography>
                            <Typography variant="body1">
                                Tailored services to meet your pet’s needs, from walks to overnight stays.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            {/* <SecurityIcon sx={{ fontSize: 60 }} /> */}
                            <Typography variant="h6" component="h3" gutterBottom>
                                Safe and Secure
                            </Typography>
                            <Typography variant="body1">
                                Peace of mind with real-time updates, photos, and secure online payments.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            {/* <StarRateIcon sx={{ fontSize: 60 }} /> */}
                            <Typography variant="h6" component="h3" gutterBottom>
                                5-Star Ratings
                            </Typography>
                            <Typography variant="body1">
                                Join a community of happy pet owners who trust us with their beloved companions.
                            </Typography>
                        </Box>
                    </Grid>
                    {/* "Get Started" Button */}
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button variant="contained" color="primary" component={Link} to="/login">
                                Get Started
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <img src={manAndDogImage} alt="Man and Dog" className="bottom-left-image"/>
           
           
      

        </div>
    );
}
