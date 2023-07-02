import React, {useEffect} from "react";
import './NotFound.css';

import Header from '../Utils/Header';
import useRequest from "../../hooks/useRequest";

function NotFound() {
    const { response, makeRequest } = useRequest();
    useEffect(() => {
        makeRequest({url: '/api/users/currentuser', method: 'get'});
    }, [makeRequest]);

    return (
        <div>
            <Header isVerified={response?.isSuccess}/>
            <div className="not-found-body">
                <h1><span>Not</span> Found</h1>
                <p>Click here tp gp back to <a href="/">home</a></p>
            </div>
        </div>
    );
}

export default NotFound;