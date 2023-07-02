import React from "react";
import './Signin.css';

import Header from '../Utils/Header';
import Form from "./Form";

function Signin() {
    return (
        <div>
            <Header />
            <div className="container">
                <Form />
            </div>
        </div>
    );
}

export default Signin;