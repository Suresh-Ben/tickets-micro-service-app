import { useState } from 'react';
import axios from 'axios';

function useRequest() {
    const [response, setResponse] = useState(null);

    function makeRequest({ url, method, body }) {
        axios[method](url, body)
            .then(res => {
                setResponse({
                    isSuccess: true,
                    data: res.response ? res.response.data : ''
                });
            })
            .catch(err => {
                setResponse({
                    isSuccess: false,
                    data: err.response.data.errors
                });
            })
    }

    return { response, makeRequest };
}

export default useRequest;