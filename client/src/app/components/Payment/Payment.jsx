import React, { useEffect, useState } from "react";
import './Payment.css';
import { useParams, useNavigate } from "react-router-dom";

import useRequest from "../../hooks/useRequest";
import Header from "../Utils/Header";

function Payment() {

    const { orderId } = useParams();
    const navigate = useNavigate();
    const { response, makeRequest } = useRequest();
    const [ isVerified, setIsVerified ] = useState(false);
    const [ order, setOrder ] = useState();
    const [ timerStarted, setTimerStarted ] = useState(false);
    const [ time, setTime ] = useState(`00 : 00`);
    const [ paymentFeed, setPaymentFeed ] = useState(null);

    useEffect(()=>{
        makeRequest({url: '/api/users/currentuser', method: 'get', type: 'auth'});
        getOrderInfo();
    },[]);

    useEffect(()=>{
        if(!response) return;
        if(response.type === 'auth' && response.isSuccess)
            setIsVerified(true);
        else if(response.type === 'auth' && !response.isSuccess)
            navigate('/signup');
        else if(response.type === 'order-details' && response.isSuccess)
            setOrder(response.data);
        else if(response.type === 'order-details' && !response.isSuccess)
            navigate('/404');
        else if(response.type === 'payment' && response.isSuccess) {
            setPaymentFeed({
                color: 'green',
                message: 'Your payment is succefull!!! you will be redirected to main page.'
            })
            setTimeout(()=>{
                navigate('/orders');
            },1000);
        }
        else if(response.type === 'payment' && !response.isSuccess) {
            setPaymentFeed({
                color: 'red',
                message: 'Your payment is unsuccefull!!! Please try again.'
            })
        }
    }, [response]);

    function getOrderInfo() {
        setTimeout(()=>{
            makeRequest({url: `/api/orders/${orderId}`, method: 'get', type: 'order-details'});
        }, 500);
    }

    useEffect(()=>{
        if(!order) return;
        if(order.status === 'complete' || order.status === 'cancelled')
            navigate('/404');
        if(order.status != 'awaiting:payment')
            getOrderInfo();
    }, [order]);

    //timer
    useEffect(()=>{
        if(!order || timerStarted) return;
        setTimerStarted(true);
        
        const targetDate = new Date(order.expiresAt);
        setInterval(()=>{
            const currentTime = new Date();
            const difference = targetDate.getTime() - currentTime.getTime();

            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            setTime(`${minutes} : ${seconds} minutes`);
        }, 1000);
    }, [order]);

    return(
        <div>
            <Header isVerified={isVerified}/>
            <div className="container">
                <h2>Complete payment and book your ticket</h2>
                <div>
                    order id: {orderId} <br />
                    Amount to be Paid: {order?.ticket?.price} <br />
                    Payment will expires in {time}
                </div>
                <br />
                <br />
                <br />
                <div>
                    <label htmlFor="CardNumber" style={{color: 'black'}}>Card number</label>
                    <input placeholder="Card number: 0000 0000 00XX" id="CardNumber" className="form-control" onChange={e => {
                    }}
                        disabled={true}
                    />
                    <br />

                    <label htmlFor="CVV" style={{color: 'black'}}>CVV</label>
                    <input placeholder="CVV: 0XX" id="CVV" className="form-control" onChange={e => {
                    }}
                        disabled={true}
                    />
                    <br />
                    <p style={{color: 'red'}}>This is dummy payment!!!</p>
                    <button
                        className="btn btn-primary"
                        onClick={()=>{
                            makeRequest({url: `/api/payments/${orderId}`, method: 'post', type: 'payment', body: {
                                paid: order?.ticket?.price
                            }})
                        }}
                    >
                        Confirm Payment
                    </button>
                    <p style={{color: paymentFeed?.color}}>{paymentFeed?.message}</p>
                </div>
            </div>
        </div>
    );
}

export default Payment;