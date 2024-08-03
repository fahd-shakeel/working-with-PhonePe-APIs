import "./App.css"
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import PaymentGateway from "./PaymentGateway";
import History from "./History";
import Redirect from "./Redirect";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<PaymentGateway/>} />
          <Route path="/history" element={<History/>}/>
          <Route path="/redirect-url/:merchantId/:merchantTransactionId/:name/:amount" element={<Redirect/>} />
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App;
