import React, { useState, useEffect } from "react";
import './Tickets.css';

import useRequest from "../../../hooks/useRequest";

const ticketContainerColor = ['#78C1F3', '#9BE8D8', '#E2F6CA', '#F8FDCF', '#7895CB', '#A0BFE0', '#C5DFF8','#F5F5F5', '#F2EAD3', '#DFD7BF','#FF78C4', '#E1AEFF', '#FFBDF7', '#FFECEC'];

function Tickets() {

    const { response, makeRequest } = useRequest();
    const [ tickets, setTickets ] = useState(null);
    
    useEffect(()=>{
        makeRequest({url: '/api/tickets', method: 'get'});
    },[]);

    useEffect(()=>{
        if(!response || !response.data) return;
        setTickets(response.data.reverse());
    },[response]);

    return(
        <div className="container">
            {tickets? 
                tickets.length? 
                    tickets.map((ticket, i)=>{
                        return(
                            <div key={i} className="ticket-container" style={{backgroundColor: ticketContainerColor[Math.floor(Math.random() * (ticketContainerColor.length + 1))]}}>
                                <div>
                                <a className="tickets-link" href={`/tickets/${ticket._id}`}> <h6>{ticket.title}</h6> </a>
                                <br />
                                price: {ticket.price}
                                </div>
                                <div>
                                    status: {ticket.status}
                                </div>
                            </div>
                        )
                    }) 
                : <h3>No tickets</h3>
            :'loading tickets...'}
        </div>
    );
}

export default Tickets;