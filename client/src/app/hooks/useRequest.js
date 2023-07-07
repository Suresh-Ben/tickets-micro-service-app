import { useState } from 'react';
import axios from 'axios';

function useRequest() {
    const [response, setResponse] = useState(null);

    async function makeRequest({ url, method, body, type }) {
        try {
            const res = await axios[method](url, body);
            setResponse({
                isSuccess: true,
                data: res ? res.data : '',
                type: type
            });
        } catch (err) {
            setResponse({
                isSuccess: false,
                data: err.response.data.errors,
                type: type
            });
        }
    }

    return { response, makeRequest };
}

export default useRequest;