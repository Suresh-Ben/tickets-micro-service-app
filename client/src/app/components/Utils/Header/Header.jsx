import React, {useEffect} from "react";
import './Header.css';

import useRequest from "../../../hooks/useRequest";

function Header({ isVerified }) {

    const { makeRequest, response } = useRequest();

    useEffect(()=>{
        if(response?.isSuccess)
            window.location.replace('/');
    }, [response]);

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="/">Ticketing</a>

                {
                    isVerified?
                        <div className="nav-links">
                            <a className="nav-link" href="/orders">My Orders</a>
                            <a className="nav-link" href="/tickets/new">New Ticket</a>

                            <button className="nav-link"
                                onClick={()=>{
                                    makeRequest({url: '/api/users/signout', method: 'post'});
                                }}
                            >SignOut</button>
                        </div> :
                         <div className="nav-links">
                            <a className="nav-link" href="/signup">SignUp</a>
                            <a className="nav-link" href="/signin">SignIn</a>
                        </div> 

                }

            </div>
        </nav>
    );
}

export default Header;