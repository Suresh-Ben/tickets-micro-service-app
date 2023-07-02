import { useState, useEffect } from 'react';
import './Form.css';

import useRequest from '../../../hooks/useRequest';

function Form() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { makeRequest, response } = useRequest();

    useEffect(()=>{
        if(response?.isSuccess)
            window.location.replace('/');
    }, [response]);

    return (
        <div>
            <label htmlFor="InputEmail1" style={{color: 'black'}}>Email</label>
            <input type="email" placeholder="Enter email" id="InputEmail1" className="form-control" value={email} onChange={e => {
                setEmail(e.target.value);
            }}/>
            <br />

            <label htmlFor="InputPassword" style={{color: 'black'}}>Password</label>
            <input type="password" placeholder="Enter password" id="InputPassword" className="form-control" value={password} onChange={e => {
                setPassword(e.target.value);
            }}/>
            <br />

            <button className='btn btn-primary' 
                onClick={async ()=>{
                    makeRequest({ url: '/api/users/signin', method: 'post', body: {
                        email: email,
                        password: password
                    }});
                }}
            >
                Sign In
            </button>
            <br />
            {
                (response && !response.isSuccess)? 
                <div style={{color: 'red', backgroundColor: 'pink'}}>
                    <h4>Oops</h4>
                    <ul>
                        {response.data.map((err, i) => {
                            let message = '';
                            if(err.field === 'email')
                                message = 'Email is Invalid'
                            else if(err.field === 'password')
                                message = 'Incorrect password'
                            else
                                message = 'Invalid credentials'

                            return <li key={i}>{message}</li>
                        })}
                    </ul>
                </div>
                 : ''
            }
        </div>
    );
}

export default Form;