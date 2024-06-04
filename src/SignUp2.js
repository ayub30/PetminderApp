import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Ensure these are correctly set up
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const defaultTheme = createTheme();

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sitterExperience, setSitterExperience] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [verificationFile, setVerificationFile] = useState(null);
  const navigate = useNavigate();
  const storage = getStorage();

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleVerificationChange = (e) => {
    setVerificationFile(e.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(cred => {
        const uid = cred.user.uid;

        const imageRef = ref(storage, `images/${uid}/profile.jpg`);
        const verificationRef = ref(storage, `verifications/${uid}/document.jpg`);

        return uploadBytes(imageRef, imageFile) // Upload profile image
          .then(imageSnapshot => getDownloadURL(imageSnapshot.ref)) // Get profile image URL
          .then(imageUrl => 
            uploadBytes(verificationRef, verificationFile) // Upload verification document
              .then(verificationSnapshot => getDownloadURL(verificationSnapshot.ref)) // Get document URL
              .then(verificationUrl => ({ imageUrl, verificationUrl }))
          )
          .then(urls => {
            const { imageUrl, verificationUrl } = urls;
            const randomLat = Math.random() * (42.3 - 42.2) + 42.2;
            const randomLng = Math.random() * (-71.3 + 71.2) - 71.2;

            const userData = {
              Email: email,
              UserType: userType,
              FullName: fullName,
              DateOfBirth: dateOfBirth,
              Location: { lat: randomLat, lng: randomLng },
              ImageUrl: imageUrl,
              VerificationUrl: verificationUrl,
              IsVerified: false,
              IsActive: true,
            };

            if(userType === 'sitter') {
              userData.SitterExperience = sitterExperience;
            }

            return setDoc(doc(db, "users", uid), userData);
          })
      })
      .then(() => {
        navigate(userType === 'user' ? '/UserUI' : '/login'); // Adjust the path for sitters accordingly
      })
      .catch(error => {
        console.error("Error signing up: ", error.message);
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Do you want to become a sitter or a user?</FormLabel>
                  <RadioGroup
                    row
                    aria-label="userType"
                    name="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <FormControlLabel value="sitter" control={<Radio />} label="Sitter" />
                    <FormControlLabel value="user" control={<Radio />} label="User" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fname"
                  name="fullName"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="date"
                  label="Birthday"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </Grid>
              {userType === 'sitter' && (
                <Grid item xs={12}>
                  <TextField
                    id="sitterExperience"
                    label="Sitter Experience"
                    multiline
                    rows={4}
                    fullWidth
                    value={sitterExperience}
                    onChange={(e) => setSitterExperience(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Upload Profile Image
                    <input
                      type="file"
                      hidden
                      onChange={handleImageChange}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Upload Verification Document
                    <input
                      type="file"
                      hidden
                      onChange={handleVerificationChange}
                    />
                  </Button>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2"> {/* Adjust href as necessary */}
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
