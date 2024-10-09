import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/ExpenseTable.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Modal } from '@fluentui/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const ExpenseTable = ({ handlePageChange }) => {
    const [expenses, setExpenses] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [addBalanceModal, setAddBalanceModal] = useState(false);
    const [addExpenseModal, setAddExpenseModal] = useState(false);
    const [editExpenseModal, setEditExpenseModal] = useState(false); // New state for editing expenses
    const [successMessageModal, setSuccessMessageModal] = useState(false);

    // States for adding or editing an expense
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('online');
    const [reason, setReason] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [currentExpense, setCurrentExpense] = useState(null); // State to track the expense being edited

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:8085/getExpenses');
            setExpenses(response.data);
            const response1 = await axios.get('http://localhost:8085/getBalance');
            calculateTotalBalance(response1.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const calculateTotalBalance = (currBalance) => {
        const initialBalance = 0;
        const totalExpense = currBalance.reduce((sum, expense) => sum - parseFloat(expense.amount), 0);
        setTotalBalance(initialBalance - totalExpense);
    };

    const gotohomepage = () => {
        handlePageChange('Homepage1');
    };

    const openAddBalanceModal = () => {
        setAddBalanceModal(true);
    };

    const closeAddBalanceModal = () => {
        setAddBalanceModal(false);
    };

    const openAddExpenseModal = () => {
        setAddExpenseModal(true); 
    };

    const closeAddExpenseModal = () => {
        setAddExpenseModal(false); 
    };

    const openEditExpenseModal = (expense) => { // Open the edit modal and set the current expense
        setCurrentExpense(expense);
        setAmount(expense.amount);
        setDate(expense.date);
        setReason(expense.reason);
        setCategory(expense.category);
        setPaymentMode(expense.paymentMode);
        setDescription(expense.description);
        setEditExpenseModal(true);
    };

    const closeEditExpenseModal = () => {
        setEditExpenseModal(false);
        setCurrentExpense(null);
    };

    const handleSave = async () => {
        const newBalanceData = {
            amount,
            date,
            paymentMode,
        };
        try {
            await fetch('http://localhost:8085/addBalance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBalanceData)
            });

            setTotalBalance(prevBalance => prevBalance + parseFloat(amount));
            closeAddBalanceModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddExpense = async () => {
        const newExpense = {
            amount,
            date,
            reason,
            category,
            paymentMode,
            description
        };

        try {
            await axios.post('http://localhost:8085/addExpense', newExpense);
            setTotalBalance(prevBalance => prevBalance - parseFloat(amount)); 
            setExpenses([...expenses, newExpense]); 
            closeAddExpenseModal(); 
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleEditExpense = async () => {
        const updatedExpense = {
            ...currentExpense,
            amount,
            date,
            reason,
            category,
            paymentMode,
            description
        };

        try {
            await axios.put(`http://localhost:8085/updateExpense/${currentExpense.id}`, updatedExpense);
            const updatedExpenses = expenses.map(expense =>
                expense.id === currentExpense.id ? updatedExpense : expense
            );
            setExpenses(updatedExpenses);
            closeEditExpenseModal();
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            const expenseToDelete = expenses.find(expense => expense.id === expenseId);

            await axios.delete(`http://localhost:8085/deleteExpense/${expenseId}`);
            const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
            setExpenses(updatedExpenses);

            if (expenseToDelete) {
                setTotalBalance(prevBalance => prevBalance - parseFloat(expenseToDelete.amount));
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    return (
        <>
            <div className="expense-table-container">
                <button className="btn btn-primary mb-3" title="Go back" onClick={gotohomepage}>
                    <ArrowBackIosIcon />
                </button>
                <h2>Expense Details</h2>
                <h1>Current Available Balance is: ₹{totalBalance.toFixed(2)}</h1>
                <button className="btn btn-primary mb-3" title="Add Balance" onClick={openAddBalanceModal}>
                    Add Balance
                </button>
                <button className="btn btn-primary mb-3" title="Add Expense" style={{ marginLeft: "1150px" }} onClick={openAddExpenseModal}>
                    Add Expense
                </button>
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Payment Mode</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{expense.date}</td>
                                <td>{expense.reason}</td>
                                <td>{expense.category}</td>
                                <td>{expense.amount}</td>
                                <td>{expense.paymentMode}</td>
                                <td>{expense.description}</td>
                                <td>
                                    <EditIcon
                                        onClick={() => openEditExpenseModal(expense)}
                                        title="Edit transaction"
                                        style={{ cursor: "pointer" }}
                                    />
                                    <DeleteIcon
                                        onClick={() => handleDeleteExpense(expense.id)}
                                        title="Delete transaction"
                                        style={{ marginLeft: "10px", cursor: "pointer" }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for adding balance */}
            <Modal isOpen={addBalanceModal} onDismiss={closeAddBalanceModal}>
                <div className='popup-content'>
                    <CloseIcon style={{ marginLeft: "300px", cursor: "pointer" }} onClick={closeAddBalanceModal} />
                    <h3>Add balance</h3>
                    <label htmlFor="amountInput">Enter amount</label>
                    <input
                        type="text"
                        id="amountInput"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <br />
                    <label htmlFor="dateInput">Date</label>
                    <input
                        type="date"
                        id="dateInput"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <br />
                    <label htmlFor="paymentModeInput">Payment mode</label>
                    <select
                        id="paymentModeInput"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="online">Online</option>
                        <option value="cash">Cash</option>
                    </select>
                    <br />
                    <button className="cancel" onClick={closeAddBalanceModal}>Cancel</button>
                    <button className="save" onClick={handleSave}>Add</button>
                </div>
            </Modal>

            {/* Modal for adding expense */}
            <Modal isOpen={addExpenseModal} onDismiss={closeAddExpenseModal}>
                <div className='popup-content'>
                    <CloseIcon style={{ marginLeft: "300px", cursor: "pointer" }} onClick={closeAddExpenseModal} />
                    <h3>Add Expense</h3>
                    <label>Enter amount</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <br />
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <br />
                    <label>Reason</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <br />
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <br />
                    <label>Payment mode</label>
                    <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="online">Online</option>
                        <option value="cash">Cash</option>
                    </select>
                    <br />
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <br />
                    <button className="cancel" onClick={closeAddExpenseModal}>Cancel</button>
                    <button className="save" onClick={handleAddExpense}>Add Expense</button>
                </div>
            </Modal>

            {/* Modal for editing expense */}
            <Modal isOpen={editExpenseModal} onDismiss={closeEditExpenseModal}>
                <div className='popup-content'>
                    <CloseIcon style={{ marginLeft: "300px", cursor: "pointer" }} onClick={closeEditExpenseModal} />
                    <h3>Edit Expense</h3>
                    <label>Enter amount</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <br />
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <br />
                    <label>Reason</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <br />
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <br />
                    <label>Payment mode</label>
                    <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="online">Online</option>
                        <option value="cash">Cash</option>
                    </select>
                    <br />
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <br />
                    <button className="cancel" onClick={closeEditExpenseModal}>Cancel</button>
                    <button className="save" onClick={handleEditExpense}>Save Changes</button>
                </div>
            </Modal>
        </>
    );
};

export default ExpenseTable;
