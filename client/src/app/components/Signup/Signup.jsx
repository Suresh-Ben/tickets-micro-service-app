import React from "react";
import './Signup.css';

import Header from '../Utils/Header';
import Form from "./Form";

function Signup() {
    return (
        <div>
            <Header />
            <div className="container">
                <Form />
            </div>
        </div>
    );
}

export default Signup;