import React from 'react'
import { useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

const Redirect = () => {
    const [cookie, setCookie, removeCookie] = useCookies([]);
    let merchantId = useParams();
    let merchantTransactionId = useParams();

    const onHome=()=>{

        removeCookie('name');
        removeCookie('amount');
    }

    return (
        <div>
            <label>Your Payment is Successful</label>
            <div>
                <a href='/'><button onClick={onHome}>Back to Home</button></a>
            </div>
        </div>

    )
}

export default Redirect