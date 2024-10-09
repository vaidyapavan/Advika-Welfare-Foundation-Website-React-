import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Create from './components/Create';
import Read from './components/Read';
import Error from './components/Error';
import Update from './components/Update';
import Signup from './components/Signup';
import Login from './components/Login';
import ExpenseTable from './components/ExpenseTable';
import Homepage from './components/Homepage';
import EmployeeData from './components/EmployeeData';
import AddEmployee from './components/AddEmployee';
import Homepage1 from './components/Homepage1';
import Footer from './components/Footer';
import DonationData from './components/DonationData';

function App() {
  const [email,setEmail] = useState("");

  return (
    <Router>
      {/* Routes will render only the component based on the current route */}
      <Routes>
        <Route path="/login" element={<Login  setEmail={setEmail} />} />
        <Route path="/signup" element={<Signup />}  />
        <Route path="/homepage1" element={<Homepage1 email={email}/>}  />
        <Route path="/create" element={<Create />} />
        <Route path="/read" element={<Read />} />
        <Route path="/update" element={<Update />} />
        <Route path="/expensetable" element={<ExpenseTable />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/employeedata" element={<EmployeeData />} />
        <Route path="/addemployee" element={<AddEmployee />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/donationdata" element={<DonationData />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
