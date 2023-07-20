import React, {useEffect} from "react";
import './Home.css';

import Header from '../Utils/Header';
import useRequest from "../../hooks/useRequest";
import Tickets from "./TicketsScreen";

function Home() {
    
    const { response, makeRequest } = useRequest();

    useEffect(() => {
        makeRequest({url: '/api/users/currentuser', method: 'get'});
    }, []);

    return (
        <div>
            <Header isVerified={response?.isSuccess}/>
            <h5 className="container">Tickets:</h5>
            <Tickets/>
        </div>
    );
}

export default Home;