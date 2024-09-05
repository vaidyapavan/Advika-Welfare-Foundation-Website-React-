import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/ExpenseTable.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Modal, MessageBar, MessageBarType, Button } from '@fluentui/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const ExpenseTable = ({ handlePageChange }) => {
    const [expenses, setExpenses] = useState([]);
    const [addBalanceModal, setAddBalanceModal] = useState(false);
    const [editExpenseModal, setEditExpenseModal] = useState(false);
    const [successMessageModal, setSuccessMessageModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('online');
    const [reason, setReason] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [currentExpense, setCurrentExpense] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:8085/getExpenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const gotohomepage = () => {
        handlePageChange('Homepage');
    };

    const addExpense = () => {
        handlePageChange('AddExpense');
    };

    const openAddBalanceModal = () => {
        setAddBalanceModal(true);
    };

    const closeAddBalanceModal = () => {
        setAddBalanceModal(false);
    };

    const openEditExpenseModal = (expense) => {
        setCurrentExpense(expense);
        setAmount(expense.amount);
        setDate(expense.date);
        setPaymentMode(expense.paymentMode);
        setReason(expense.reason);
        setCategory(expense.category);
        setDescription(expense.description);
        setEditExpenseModal(true);
    };

    const closeEditExpenseModal = () => {
        setEditExpenseModal(false);
        setCurrentExpense(null);
    };

    const handleSave = () => {
        const newBalanceData = {
            amount,
            date,
            paymentMode,
        };
        fetch('http://localhost:8085/addBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBalanceData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Balance saved:', data);
            closeAddBalanceModal();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleEditExpense = async () => {
        try {
            const updatedExpense = {
                date,
                reason,
                category,
                amount,
                paymentMode,
                description
            };
            await axios.put(`http://localhost:8085/updateExpense/${currentExpense.id}`, updatedExpense);
            setExpenses(expenses.map(exp => exp.id === currentExpense.id ? { ...exp, ...updatedExpense } : exp));
            closeEditExpenseModal();
            setSuccessMessageModal(true); // Show the success message modal
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            await axios.delete(`http://localhost:8085/deleteExpense/${expenseId}`);
            setExpenses(expenses.filter(expense => expense.id !== expenseId));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const closeSuccessMessageModal = () => {
        setSuccessMessageModal(false);
    };

    return (
        <>
            <div className="expense-table-container">
                <button className="btn btn-primary mb-3" title="Go back" onClick={gotohomepage}>
                    <ArrowBackIosIcon />
                </button>
                <h2>Expense Details</h2>
                <h1>Current Available Balance is: {amount}</h1>
                <button className="btn btn-primary mb-3" title="Add Balance" onClick={openAddBalanceModal}>
                    Add Balance
                </button>
                <button className="btn btn-primary mb-3" title="Add Expense" style={{ marginLeft: "1150px" }} onClick={addExpense}>
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
                    <CloseIcon style={{marginLeft:"300px", cursor:"pointer"}} onClick={closeAddBalanceModal}></CloseIcon>
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

            {/* Modal for editing expense */}
            <Modal isOpen={editExpenseModal} onDismiss={closeEditExpenseModal}>
                <div className='popup-content'>
                    <CloseIcon style={{marginLeft:"300px", cursor:"pointer"}} onClick={closeEditExpenseModal}></CloseIcon>
                    <h3>Edit Expense</h3>
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
                    <label>Amount</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <br />
                    <label>Payment Mode</label>
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
                    <button className="save" onClick={handleEditExpense}>Save</button>
                </div>
            </Modal>

            {/* Modal for success message */}
            <Modal isOpen={successMessageModal} onDismiss={closeSuccessMessageModal}>
                <div className='popup-content'>
                 
                   <h3>Data Updated Successfully!!</h3>
                   <br></br>
                    <Button   className="save" onClick={closeSuccessMessageModal}>OK</Button>
                </div>
            </Modal>
        </>
    );
};

export default ExpenseTable;
