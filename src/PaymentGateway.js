import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const PaymentGateway = () => {
  const SERVER_URL = "https://working-with-phonepe-api-1.onrender.com"
  const CLIENT_URL = "https://working-with-phonepe-api.onrender.com"

  const [name, onChangeName] = useState("");
  const [amount, onChangeAmount] = useState("");
  const [cookie, setCookie, removeCookie] = useCookies([])
  const [url, onChangeUrl] = useState("");

  const navigate = useNavigate();

  const setName = (e) => { onChangeName(e.target.value) };
  const setAmount = (e) => { onChangeAmount(e.target.value) };

  const pay = () => {
    if (name.length == 0 && amount.length == 0) {
      alert("Please enter name & amount!")
    }
    else {
      setCookie('name', name);
      setCookie('amount', amount);

      axios.post(`${SERVER_URL}/pay/${name}/${amount*100}`)
      .then((res) => window.location.href = res.data)
      .catch((err) => console.log(err))

    }
  }


  // useEffect(() => {
  //   return () => {

  //   }, [])

  const history = () => {
    window.location.href=`${CLIENT_URL}/history`;
  }

  return (
    <div id="main-page">
      <div id="heading">
        <h1>Payment Gateway</h1>
      </div>

      <div id="gateway-body">
        <div id="payment-info">
          <div id="label-input">
            <label>Name of Merchant</label>
            <input type="text" placeholder="Name" onChange={setName}></input>
          </div>

          <div id="label-input">
            <label>Enter the Amount (in Rupees)</label>
            <input type="number" placeholder="Amount should be less than 1000" onChange={setAmount}></input>
          </div>

          <div id="button">
            <button type="button" onClick={history}>History</button>
            <button type="submit" onClick={pay}>Pay</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;
