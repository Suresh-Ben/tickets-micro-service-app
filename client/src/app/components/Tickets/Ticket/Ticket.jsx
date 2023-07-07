import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import './Ticket.css';

import useRequest from "../../../hooks/useRequest";

function Ticket() {

    const { ticketId } = useParams();
    const [ ticket, setTicket ] = useState(null);
    const [ order, setOrder ] = useState();
    const { buyError, setBuyError } = useState();
    const { response, makeRequest } = useRequest();
    const navigate = useNavigate();

    useEffect(()=>{
        makeRequest({url: `/api/tickets/${ticketId}`, method: 'get', type: 'ticket'});
    }, []);

    useEffect(()=>{
        if(!response) return;
        if(response.type == 'ticket') {
            if(!response.isSuccess)
                navigate('/404');
            setTicket(response.data);
        }
        else if(response.type == 'order' && response.isSuccess) {
            setOrder(response.data);
        }
        else if(response.type == 'order' && !response.isSuccess) {
            setBuyError('Error Buying ticket');
        }
    }, [response]);

    useEffect(()=>{
        if(!order) return;
        navigate(`/payments/${order._id}`)
    }, [order]);

    return(
        <div>
            {ticket? 
                <div className="container ticket">
                    <h2>Buy your tickets here...</h2>
                    <div style={{width: '100%'}}>
                        <h6 style={{display: 'inline-block'}}>ticket Name: </h6> <h4 style={{display: 'inline-block'}}>{ticket.title}</h4><br />
                        <h6 style={{display: 'inline-block'}}>ticket Price: </h6> <h5 style={{display: 'inline-block'}}>{ticket.price}</h5><br />
                        <h6 style={{display: 'inline-block'}}>ticket status: : </h6> <h6 style={{display: 'inline-block', color: ticket.status == 'available'? 'green': 'red'}}>{ticket.status}</h6>

                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button
                                className="btn btn-primary"
                                style={{display: 'block'}}
                                onClick={async ()=>{
                                    await makeRequest({
                                        url: '/api/orders',
                                        method: 'post',
                                        body: {
                                            ticketId: ticketId
                                        },
                                        type: 'order'
                                    });
                                }}
                                disabled={ticket.status != 'available'}
                            >
                                Buy Ticket
                            </button>
                            <p style={{color: 'red'}}>{buyError}</p>
                        </div>
                    </div>
                </div>
            :'loading...'}
        </div>
    );
}

export default Ticket;