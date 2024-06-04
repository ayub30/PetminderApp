import React, { useState } from "react";
import { Link,useNavigate } from 'react-router-dom';
import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import ImageDropzone from './ImageDropzone'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sitterExperience, setSitterExperience] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const [verificationFile, setVerificationFile] = useState(null);
  const storage = getStorage();

  const handleImageAccepted = (e) => {
    setImageFile(e.target.files[0]);
  };
  
  const handleVerifyAccepted = (e) => {
    setVerificationFile(e.target.files[0]);;
  };

  const signUpForm = (e) => {
    e.preventDefault();
    console.log("User type is:", userType); 

    createUserWithEmailAndPassword(auth, email, password)
        .then(cred => {
            const uid = cred.user.uid;
            
            const imageRef = ref(storage, `images/${uid}/profile.jpg`);
            const verificationRef = ref(storage, `verifications/${uid}/document.jpg`);
            const randomLat = Math.random() * (42.3 - 42.2) + 42.2;
            const randomLng = Math.random() * (-71.3 + 71.2) - 71.2;

            const uploadImage = imageFile ? uploadBytes(imageRef, imageFile).then(imageSnapshot => getDownloadURL(imageSnapshot.ref)) : Promise.resolve(null);
            const uploadVerification = verificationFile ? uploadBytes(verificationRef, verificationFile).then(verificationSnapshot => getDownloadURL(verificationSnapshot.ref)) : Promise.resolve(null);

            return Promise.all([uploadImage, uploadVerification])
                .then(([imageUrl, verificationUrl]) => {
                  let userDocData = {
                    Email: email,
                    UserType: userType,
                    FullName: fullName,
                    DateOfBirth: dateOfBirth
                };

                // Add sitter-specific data if userType is sitter
                if (userType === 'sitter') {
                    // Generate random location for sitter only
                    const randomLat = Math.random() * (42.3 - 42.2) + 42.2;
                    const randomLng = Math.random() * (-71.3 + 71.2) - 71.2;
                    
                    userDocData = {
                        ...userDocData,
                        Location: { lat: randomLat, lng: randomLng },
                        ImageUrl: imageUrl,
                        VerificationUrl: verificationUrl,
                        IsVerified: false,
                        IsActive: true
                    };
                  }
                    console.log("User document data:", userDocData); 
                    
                    return setDoc(doc(db, "users", uid), userDocData);
                });
        })
        .then(() => {
            navigate(userType === 'user' ? '/UserUI' : '/login');
        })
        .catch(error => {
            console.error("Error signing up: ", error.message);
        });
};



      


  return (
    <div className='sign-up-container'>
      <h1>Make an account</h1>
      <form onSubmit={signUpForm}>
        <div>
          <h2>Do you want to become a sitter or a user?</h2>
          <label>
            <input
              type="radio"
              name="userType"
              value="sitter"
              checked={userType === 'sitter'}
              onChange={(e) => setUserType(e.target.value)}
            /> Sitter
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="user"
              checked={userType === 'user'}
              onChange={(e) => setUserType(e.target.value)}
            /> User
          </label>
        </div>
        <br />
        {userType && (
          <>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <br />
            <div className="date-of-birth-input">
              <label htmlFor="dob">Date of Birth </label>
              <input
                type="date"
                id="dob"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <br />
            {userType === 'sitter' && (
              <>
                <textarea
                  placeholder="Enter your experience and why you want to become a sitter"
                  value={sitterExperience}
                  onChange={(e) => setSitterExperience(e.target.value)}
                  rows="8"
                  style={{ width: '100%' }}
                ></textarea>
                <label>Image</label>
                <input type='file' onChange={handleImageAccepted}></input>
                <label>Verification</label>
                <input type='file' onChange={handleVerifyAccepted}></input><br/>
              </>
            )}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </>
        )}
        <p>Already have an account? <Link to="/signuppage">Sign in here</Link></p>
      </form>
    </div>
  );
};
 
