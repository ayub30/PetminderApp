import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Map.css";
import L from "leaflet";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, query, where, onSnapshot } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';

function Map() {
    const [center, setCenter] = useState({ lat: 42.288323, lng: -71.228063 });
    const zoom_level = 13;
    const mapRef = useRef();
    const navigate = useNavigate();
    const [sitters, setSitters] = useState([]);
    const [user] = useAuthState(auth);

    useEffect(() => {
        const activeSittersQuery = query(collection(db, "users"), where("UserType", "==", "sitter"), where("isActive", "==", true));
        const unsubscribe = onSnapshot(activeSittersQuery, (querySnapshot) => {
            const sitterData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setSitters(sitterData);
        });

        return () => unsubscribe(); // This is important to unsubscribe when the component unmounts
    }, []);

    const markerIcon = new L.Icon({
        iconUrl: require('../img/marker.png'),
        iconSize: [38, 38]
    });

    const handleMarkerClick = async (sitter) => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userRef); // Correct use of getDoc for a single document
            if (userDocSnap.exists() && userDocSnap.data().UserType === 'user') {
                navigate('/booking', { state: { sitter: sitter } });
            } else {
                alert("Only users can book sitters.");
            }
        } else {
            alert("You must be signed in and be a user to book sitters.");
        }
    };

    return (
        <div>
            <h1>Sitter Map</h1>
            <MapContainer center={center} zoom={zoom_level} ref={mapRef}>
                <TileLayer
                    url={'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=GaUPsiSvtar38nB5vtZ8'}
                    attribution={'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'}
                />
                {sitters.map(sitter => (
                    <Marker
                        key={sitter.id}
                        position={[sitter.Location.lat, sitter.Location.lng]}
                        icon={markerIcon}
                        eventHandlers={{
                            click: () => handleMarkerClick(sitter) // Pass the sitter to the click handler
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}

export default Map;
