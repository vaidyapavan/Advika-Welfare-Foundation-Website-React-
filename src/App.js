import './App.css';
import React,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Create from './components/Create';
import Read from './components/Read';
import Error from './components/Error';
import Update from './components/Update';
import Signup from './components/Signup';
import Login from './components/Login';
import AddExpense from './components/AddExpense';
import ExpenseTable from './components/ExpenseTable';
import Homepage from './components/Homepage';
import EmployeeData from './components/EmployeeData';
import AddEmployee from './components/AddEmployee';
import Homepage1 from './components/Homepage1';
import Footer from './components/Footer';
import DonationData from './components/DonationData';

function App() {
  const [pageName, setPageName] = useState('Homepage'); // Maintain state for page name

  const handlePageChange = (newPageName) => {
    setPageName(newPageName); // Function to change the current page
  };

  return (
    <Router>
      {/* Routes will render the current route-based components */}
      <Routes>
        <Route path="/login" element={<Login handlePageChange={handlePageChange} />} />
        <Route path="/signup" element={<Signup handlePageChange={handlePageChange} />} />
        <Route path="/homepage1" element={<Homepage1 handlePageChange={handlePageChange} />} />
        <Route path="/create" element={<Create handlePageChange={handlePageChange} />} />
        <Route path="/read" element={<Read handlePageChange={handlePageChange} />} />
        <Route path="/update" element={<Update handlePageChange={handlePageChange} />} />
        <Route path="/addexpense" element={<AddExpense handlePageChange={handlePageChange} />} />
        <Route path="/expensetable" element={<ExpenseTable handlePageChange={handlePageChange} />} />
        <Route path="/" element={<Homepage handlePageChange={handlePageChange} />} />
        <Route path="/employeedata" element={<EmployeeData handlePageChange={handlePageChange} />} />
        <Route path="/addemployee" element={<AddEmployee handlePageChange={handlePageChange} />} />
        <Route path="/footer" element={<Footer handlePageChange={handlePageChange} />} />
        <Route path="/DonationData" element={<DonationData handlePageChange={handlePageChange} />} />
        <Route path="*" element={<Error handlePageChange={handlePageChange} />} /> {/* Catch-all route */}
      </Routes>

      {/* Conditionally render the page based on the value of pageName */}
      {pageName === 'Login' && <Login handlePageChange={handlePageChange} />}
      {pageName === 'Signup' && <Signup handlePageChange={handlePageChange} />}
      {pageName === 'Homepage1' && <Homepage1 handlePageChange={handlePageChange} />}
      {pageName === 'Read' && <Read handlePageChange={handlePageChange} />}
      {pageName === 'Create' && <Create handlePageChange={handlePageChange} />}
      {pageName === 'Update' && <Update handlePageChange={handlePageChange} />}
      {pageName === 'AddExpense' && <AddExpense handlePageChange={handlePageChange} />}
      {pageName === 'ExpenseTable' && <ExpenseTable handlePageChange={handlePageChange} />}
      {pageName === 'Homepage' && <Homepage handlePageChange={handlePageChange} />}
      {pageName === 'EmployeeData' && <EmployeeData handlePageChange={handlePageChange} />}
      {pageName === 'AddEmployee' && <AddEmployee handlePageChange={handlePageChange} />}
      {pageName === 'DonationData' && <DonationData handlePageChange={handlePageChange} />}
      {pageName === 'Footer' && <Footer handlePageChange={handlePageChange} />}
      {pageName === 'Error' && <Error handlePageChange={handlePageChange} />}
    </Router>
  );
}

export default App;
