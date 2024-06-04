import React from "react";
import "../UserUI/User.css";
import Map from "../UserUI/UserMap";
import Toggle from './ActivityToggle';

function User(){
    return(
        <div className="container">
            <div>
                <Toggle />
                <Map />
            </div>

        </div>
    );
}
export default User;