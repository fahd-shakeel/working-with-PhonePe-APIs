import React from 'react'
import "./TransactionCard.css"

const TransactionCard = (props) => {
    return (
        <>
            <tbody >
                <tr>
                    <td>{props.date.slice(0,10)}</td>
                    <td>{props.name}</td>
                    <td>{props.transactionId}</td>
                    <td>Rs. {props.amount}</td>
                </tr>
            </tbody>
        </>
    )
}

export default TransactionCard