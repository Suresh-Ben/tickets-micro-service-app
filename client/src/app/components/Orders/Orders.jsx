import React, { useEffect, useState } from 'react';
import './Orders.css';

import Header from '../Utils/Header';
import useRequest from '../../hooks/useRequest';
import { useNavigate } from 'react-router-dom';

const orderContainerColor = ['#78C1F3', '#9BE8D8', '#E2F6CA', '#F8FDCF', '#7895CB', '#A0BFE0', '#C5DFF8', '#F5F5F5', '#F2EAD3', '#DFD7BF','#FF78C4', '#E1AEFF', '#FFBDF7', '#FFECEC'];

function Orders() {

    const { response, makeRequest } = useRequest();
    const [ orders, setOrders ] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        makeRequest({url: '/api/users/currentuser', method: 'get', type: 'user'});
    }, []);

    useEffect(()=>{
        if(!response) return;
        if(response.type === 'user') 
            makeRequest({url: '/api/orders', method: 'get', type: 'order'});
        else if(response.type === 'order') {
            if(response.data)
            setOrders(response.data.reverse());
        }
        else if(response.type === 'order-delete') {
            window.location.reload(false);
        }
    }, [response])

    return(
        <div>
            <Header isVerified={response?.isSuccess}/>
            <div className='container'>
            <h5>Orders:</h5>
                {orders? 
                    orders.length? 
                    orders.map((order, i)=>{
                        return (
                            <div key={i} className='order-container' style={{backgroundColor: orderContainerColor[Math.floor(Math.random() * (orderContainerColor.length + 1))]}}>
                                <div>
                                    Order id: {order._id} <br />
                                    <h6 style={{display: 'inline-block'}}>Tickeet name: </h6> <h4 style={{display: 'inline-block'}}>{order.ticket.title}</h4><br />
                                    <h6 style={{display: 'inline-block'}}>Amount to be paid: </h6> <h5 style={{display: 'inline-block'}}>{order.ticket.price}</h5><br />
                                    <h6 style={{display: 'inline-block'}}>Order status: </h6> 
                                    <h6
                                        style={{ display: 'inline-block', color: order.status === 'cancelled'? 'red' : order.status === 'complete'? 'green': 'orange'}}
                                    >{order.status}</h6>
                                </div>

                                <div className='order-buttons-container'>
                                    <button className='order-button' style={{color: 'red'}}
                                        disabled={order.status === 'cancelled'}
                                        onClick={()=>{
                                            makeRequest({url: `/api/orders/${order._id}`, method: 'delete', type: 'order-delete'});
                                        }}
                                    >Cancel Order</button>
                                    <button className='order-button' style={{color: 'green'}}
                                        onClick={()=>{
                                            navigate(`/payments/${order._id}`);
                                        }}
                                        disabled={order.status !== 'awaiting:payment'}
                                    >Confirm Order</button>
                                </div>
                            </div>
                        )
                    })
                    : 'No orders yet!!!'
                : 'loading orders...'}
            </div>
        </div>
    );
}

export default Orders;