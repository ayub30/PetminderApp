import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export default function SwitchLabels() {

  const [user] = useAuthState(auth);
  
  const toggleIsActive = async (event) => {
    const isActive = event.target.checked;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        isActive: isActive
      });
    }
  };

  return (
    <FormGroup>
      <FormControlLabel control={<Switch onChange={toggleIsActive} />} label="Activity Toggle" sx={{color: 'white', justifyContent: 'end'}} />
    </FormGroup>
  );
}