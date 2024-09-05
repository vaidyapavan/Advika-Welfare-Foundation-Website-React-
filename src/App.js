import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Create from './components/Create';
import Read from './components/Read';
import Error from './components/Error';
import Update from './components/Update';
import Signup from './components/Signup';
import Login from './components/Login';
import AddExpense from './components/AddExpense';
import ExpenseTable from './components/ExpenseTable';
import Homepage from './components/Homepage';


function App() {
  const [pageName, setPageName] = useState('Login');

  const handlePageChange = (newPageName) => {
    setPageName(newPageName); 
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login handlePageChange={handlePageChange} />} />
        <Route path="/signup" element={<Signup handlePageChange={handlePageChange} />} />
        <Route path="/create" element={<Create handlePageChange={handlePageChange} />} />
        <Route path="/read" element={<Read handlePageChange={handlePageChange} />} />
        <Route path="/update" element={<Update handlePageChange={handlePageChange} />} />
        <Route path="/addexpense" element={<AddExpense handlePageChange={handlePageChange} />} />
        <Route path="/expensetable" element={<ExpenseTable handlePageChange={handlePageChange} />} />
        <Route path="/homepage" element={<Homepage handlePageChange={handlePageChange} />} />
        <Route path="Error" element={<Error handlePageChange={handlePageChange} />} />
      </Routes>
      {/* Render the current page conditionally based on pageName */}

      {pageName === 'Login' && <Login handlePageChange={handlePageChange} />}
      {pageName === 'Signup' && <Signup handlePageChange={handlePageChange} />}
      {pageName === 'Read' && <Read handlePageChange={handlePageChange} />}
      {pageName === 'Create' && <Create handlePageChange={handlePageChange} />}
      {pageName === 'Update' && <Update handlePageChange={handlePageChange} />}
      {pageName === 'AddExpense' && <AddExpense handlePageChange={handlePageChange} />}
      {pageName === 'ExpenseTable' && <ExpenseTable handlePageChange={handlePageChange} />}
      {pageName === 'Homepage' && <Homepage handlePageChange={handlePageChange} />}
      {pageName === 'Error' && <Error handlePageChange={handlePageChange} />}
    </Router>
  );
}

export default App;
