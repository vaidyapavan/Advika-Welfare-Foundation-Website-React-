import React, { useState } from 'react';
import axios from 'axios';
import '../assets/AddExpense.css';
import CloseIcon from '@mui/icons-material/Close';

const AddExpense = ({ handlePageChange, setTotalBalance }) => {
    let [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [category, setCategory] = useState('');
    const [paymentMode, setPaymentMode] = useState('online');
    const [description, setDescription] = useState('');

    const handleSave = async () => {
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
            amount = -amount;
            const newBalanceData = {
                amount,
                date,
                paymentMode,
            };
            await fetch('http://localhost:8085/addBalance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBalanceData)
            });
            // setTotalBalance(prevBalance => prevBalance - parseFloat(amount));
            handlePageChange('ExpenseTable');
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    return (
        <div className="add-expense-container">
            <h2>Add Expense</h2>
            <button className="btn btn-primary mb-3" onClick={() => handlePageChange('ExpenseTable')}>
                <CloseIcon />
            </button>
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
                type="number"
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
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <button className="cancel" onClick={() => handlePageChange('ExpenseTable')}>Cancel</button>
            <button className="save" onClick={handleSave}>Save</button>
        </div>
    );
};

export default AddExpense;
