import React, { useState } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme();

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userType = userData.UserType;
        const isVerified = userData.IsVerified;

        console.log(`UserType: ${userType}, IsVerified: ${isVerified}`);

        if (userType === 'sitter' && isVerified !== true) {
          await signOut(auth);
          alert("Wait for verification!");
        } else if (userType === 'user') {
          navigate('/UserUI');
        } else if (userType === 'sitter') {
          navigate('/SitterUI');
        }
      } else {
        console.error("No user document found.");
      }
    } catch (error) {
      console.error("SignIn error:", error);
      alert("Failed to log in. Please check your email and password.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
            Log In to your account
          </Typography>
          <Box component="form" noValidate onSubmit={signIn} sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/signupp" variant="body2">
                  Don't have an account? Sign up here
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
