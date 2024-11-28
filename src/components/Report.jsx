import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../assets/Report.module.css'; 
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ComboBox } from '@fluentui/react'; // Use ComboBox for multi-select
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { DatePicker, mergeStyles } from '@fluentui/react';

const rootClass = mergeStyles({ maxWidth: 300, selectors: { '> *': { marginBottom: 15 } } });

const Report = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);

    // State for filtering
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categoryOptions = [
        { key: 'All', text: 'All' },
        { key: 'Education', text: 'Education' },
        { key: 'Travelling', text: 'Travelling' },
        { key: 'Cloth', text: 'Cloth' },
        { key: 'Medicine', text: 'Medicine' },
        { key: 'Grocery', text: 'Grocery' },
        { key: 'Student Welfare', text: 'Student Welfare' },
        { key: 'Office Expense', text: 'Office Expense' },
    ];
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:8085/getExpenses');
            setExpenses(response.data);
            setFilteredExpenses(response.data); // Initially, all expenses are shown
            calculateTotalExpense(response.data); // Calculate the total expense at start
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const calculateTotalExpense = (expenses) => {
        const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        setTotalExpense(total);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const goToHomepage = () => {
        navigate('/homepage1');
    };

    const gotoNextpage = () =>
    {
        navigate('/inventorydata');

    }

    const handleSearch = () => {
        let filtered = expenses;

        // Filter by date range
        if (startDate && endDate) {
            filtered = filtered.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startDate && expenseDate <= endDate;
            });
        }

        // Filter by selected categories
        if (selectedCategories.length > 0 && !selectedCategories.includes('All')) {
            filtered = filtered.filter(expense => selectedCategories.includes(expense.category));
        }

        setFilteredExpenses(filtered);
        calculateTotalExpense(filtered); // Recalculate total expense after filtering
    };

    const handleComboBoxChange = (event, option) => {
        if (option) {
            const currentSelection = selectedCategories.includes(option.key)
                ? selectedCategories.filter(cat => cat !== option.key)
                : [...selectedCategories, option.key];

            setSelectedCategories(currentSelection);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.reportTableContainer}>
                <button className={styles.btn} title="Go back" onClick={goToHomepage}>
                    <ArrowBackIosIcon />
                </button>
                <h1 className={styles.header}>Monthly report</h1>

                <div className={styles.filterContainer}>
                    <DatePicker
                        placeholder='Select Start Date'
                        value={startDate}
                        onSelectDate={setStartDate}
                    />
                    <DatePicker
                        placeholder='Select End Date'
                        value={endDate}
                        onSelectDate={setEndDate}
                    />
                    <ComboBox
                        placeholder='Select Expense Categories'
                        options={categoryOptions}
                        selectedKey={selectedCategories}
                        onChange={handleComboBoxChange}
                        multiSelect
                    />
                    <Button variant="contained" onClick={handleSearch}>Search</Button>
                </div>

                <div className={styles.scrollableTableContainer}>
                    <table className={styles.reportTable}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Reason</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Payment Mode</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{formatDate(expense.date)}</td>
                                    <td>{expense.reason}</td>
                                    <td>{expense.category}</td>
                                    <td>{expense.amount}</td>
                                    <td>{expense.paymentMode}</td>
                                    <td>{expense.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.reportFooter}>
                    <button variant="contained" className={styles.goback} onClick={goToHomepage}>Back</button>
                    <button variant="contained" className={styles.nextButton}onClick={gotoNextpage}>Export to Excel</button>
                </div>





            </div>
            <h3 className={styles.totalBalance} style={{ marginLeft: "730px" }}>Total: ₹{totalExpense.toFixed(2)}</h3>


        </div>

    );
};

export default Report;
