import React, { useState } from 'react'
import "./dogProfiles.css"
import { doc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function BasicForm({ onAddProfile, onClose }){
    const [Name,setName] = useState('');
    const [Description,setDescription] = useState('')
    const [Image,setImage] = useState(null);
    const [user] = useAuthState(auth);


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Make sure there is an image and a user before proceeding
        if (Image && user) {
            const storage = getStorage();
            const imageRef = ref(storage, `dogImages/${Image.name}`);
    
            // Upload the image to Firebase Storage
            try {
                const snapshot = await uploadBytes(imageRef, Image);
                const downloadURL = await getDownloadURL(snapshot.ref);
    
                // Add the new profile to Firestore and get the reference to the new document
                const docRef = await addDoc(collection(db, 'dogProfiles'), {
                    dogName: Name,
                    dogDescription: Description,
                    dogImage: downloadURL,
                    userId: user.uid
                });
    
                // Update the parent component's state with the new profile including the document id
                onAddProfile({
                    id: docRef.id, // This is the new id of the document in Firestore
                    dogName: Name,
                    dogDescription: Description,
                    dogImage: downloadURL,
                    userId: user.uid
                });
    
                // Reset the form fields and close the form
                setName('');
                setDescription('');
                setImage(null);
                onClose();
    
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        } else {
            // Handle the case where there is no image or user is not authenticated
            console.error("No image provided or user not authenticated");
        }
    };
    

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
        } 
    };

    return(
        <div className="form-con">
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <h2>Add Profile</h2>
                </div>
                <div className='form-row'>
                    <label for="title">Dog Name:</label>
                    <input type="text" name="title" placeholder="Write Name" value={Name} onChange={(e) => setName(e.target.value)}></input>
                </div>
                <label for="file" className="form-row">Dog Picture:</label>
                <input type="file" name="file" placeholder="File" className="form-row" onChange={handleImageChange}></input>
                <div className='form-row'>
                <label for="description" className='description'>Description:</label>
                    <textarea
                        id="description"
                        name="desc"
                        rows="4" 
                        value={Description} 
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <button className="form-row">Submit</button>
            </form>
        </div>
    );
}
export default BasicForm;