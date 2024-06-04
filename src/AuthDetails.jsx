import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {auth} from"./firebase"

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);


    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });



        return ()=>{
            listen();
        }
        
    }, []);

     const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('sign out successful');
        }).catch(error => {
           console.log(error);
       });
    };



    return (
        <div>
           {authUser ? <><p>Signed in as {authUser.email}</p><button onClick={userSignOut}>Sign out</button></> : <p>Signed out</p>}
        </div>
    );
};

export default AuthDetails;



