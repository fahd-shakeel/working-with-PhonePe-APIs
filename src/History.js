import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import "./History.css"
import TransactionCard from './TransactionCard.js';

const History = () => {
    const SERVER_URL = "http://localhost:3001"
    
    const [data, onChangeData] = useState([]);

    const transactionData = [{
        id: 1,
        name: "fahd",
        date: "2023-01-13",
        amount: "10000"
    },
    {
        id: 2,
        name: "ahad",
        date: "2023-01-13",
        amount: "2312",
        transactionId:"asdfa"
    }, {
        id: 3,
        name: "sahil",
        date: "2023-01-13",
        amount: "23.5"
    }, {
        id: 4,
        name: "adil",
        date: "2023-01-13",
        amount: "1240"
    }]

    const TransactionCardLayout = () => {
        return data.map((details) => {
            return <TransactionCard name={details.name} date={details.date} amount={details.amount} transactionId={details.transactionId}/>
        })
    }

    useEffect( () => {
        axios.get(`${SERVER_URL}/history`)
            .then((res) =>onChangeData(res.data))
            .catch((err) => console.log({ "Error": err }))
    },[])

    return (
        <>
            <div id="history">
                <h1 id='heading'>Payment History</h1>
                <a href='/'><button >Go Back</button></a>
            </div>

            <div id="transaction-list">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Transaction Id</th>
                            <th>Amount paid</th>
                        </tr>
                    </thead>
                    {TransactionCardLayout()}
                </table>
            </div>
        </>
    )
}

export default History