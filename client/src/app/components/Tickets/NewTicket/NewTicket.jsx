import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './NewTicket.css';

import useRequest from "../../../hooks/useRequest";

function NewTicket() {

    const [ ticketName, setTicketName ] = useState('');
    const [ ticketPrice, setTicketPrice ] = useState('');
    const { response, makeRequest } = useRequest();

    const navigate = useNavigate();

    useEffect(()=>{
        if(!response) return;
        navigate('/');
    }, [response])

    return(
        <div className="container">
            <h2>Create your own tickets</h2>
            <br />
            <label htmlFor="ticketName" style={{color: 'black'}}>Name: </label>
            <input placeholder="Enter ticket name" id="ticketName" className="form-control" value={ticketName} onChange={e => {
                setTicketName(e.target.value);
            }}/>
            <br />

            <label htmlFor="ticketPrice" style={{color: 'black'}}>Price: </label>
            <input type="number" placeholder="Enter ticket price" id="ticketPrice" className="form-control" value={ticketPrice} onChange={e => {
                setTicketPrice(e.target.value);
            }}/>
            <br />

            <button className="btn btn-primary"
                onClick={async ()=>{
                    await makeRequest({url: '/api/tickets', method: 'post', body: {
                        title: ticketName,
                        price: ticketPrice
                    }});
                }}
            >
                Create Ticket
            </button>
        </div>
    );
}

export default NewTicket;