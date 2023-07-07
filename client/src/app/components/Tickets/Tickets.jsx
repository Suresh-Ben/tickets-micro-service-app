import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import './Tickets.css';

import useRequest from "../../hooks/useRequest";

import Header from '../Utils/Header';
import NewTicket from "./NewTicket/NewTicket";
import Ticket from "./Ticket";

function Tickets() {
    
    const { response, makeRequest } = useRequest();
    const navigate = useNavigate();

    useEffect(()=>{
        makeRequest({url: '/api/users/currentuser', method: 'get'});
    }, []);

    useEffect(()=>{
        if(!response) return;
        if(!response.isSuccess) navigate('/signup');
    }, [response]);

    return(
        <div>
            <Header isVerified={response?.isSuccess}/>
            <Routes>
                <Route path="/new" element={<NewTicket />} />
                <Route path="/:ticketId" element={<Ticket />} />
            </Routes>

        </div>
    );
}

export default Tickets;