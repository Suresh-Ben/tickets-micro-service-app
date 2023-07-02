import React, {useEffect} from "react";
import './Home.css';

import Header from '../Utils/Header';
import useRequest from "../../hooks/useRequest";

function Home() {
    const { response, makeRequest } = useRequest();
    useEffect(() => {
        makeRequest({url: '/api/users/currentuser', method: 'get'});
    }, [makeRequest]);

    return (
        <div>
            <Header isVerified={response?.isSuccess}/>
            { response?.isSuccess? 'You are logged in' : 'You are NOT logged in'}
        </div>
    );
}

export default Home;