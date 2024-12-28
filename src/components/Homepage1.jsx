import React, { useState } from 'react';
import '../assets/Homepage1.css';
// import logo from '../assets/images/advikalogo.png';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PageFooter from './PageFooter';
import ExpenseTable from './ExpenseTable';
import DonationData from './DonationData';
import Read from './Read';
import EmployeeData from './EmployeeData';
import Report from './Report';
import InventoryData from './InventoryData';

const Homepage1 = ({ email }) => {

    const sections = ['donation', 'expense', 'student', 'employee', 'report', 'inventory'];

const goToBackScreen = () => {
    const currentIndex = sections.indexOf(activeComponent);
    if (currentIndex > 0) {
        setActiveComponent(sections[currentIndex - 1]);
    }
}

const goToNextScreen = () => {
    const currentIndex = sections.indexOf(activeComponent);
    if (currentIndex < sections.length - 1) {
        setActiveComponent(sections[currentIndex + 1]);
    }
}

    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState('expense'); // Default load Expense component

    const navigateTo = (section) => {
        setActiveComponent(section);
    }

    const renderComponent = () => {
        switch (activeComponent) {
            case 'expense':
                return <ExpenseTable />;
            case 'donation':
                return <DonationData />;
            case 'student':
                return <Read />;
            case 'employee':
                return <EmployeeData />;
            case 'report':
                return <Report />;
            case 'inventory':
                return <InventoryData />;
            default:
                return <ExpenseTable />;
        }
    }

    return (
        <>
        
            <div className="container">
                {/* Sidebar navigation */}
                <div className="sidebar">
                    {/* <img src={logo} alt="Advika Logo" className="logo" /> */}
                    <AccountBoxIcon style={{ fontSize: "80px", marginLeft: "auto", marginRight: "auto" }} />
                    <h3>{email}</h3>
                    <ul className="nav-items">
                        <li onClick={() => navigateTo('donation')}>Donation Data</li>
                        <li onClick={() => navigateTo('expense')}>Expense</li>
                        <li onClick={() => navigateTo('student')}>Student Data</li>
                        <li onClick={() => navigateTo('employee')}>Employee Data</li>
                        <li onClick={() => navigateTo('report')}>Monthly Report</li>
                        <li onClick={() => navigateTo('inventory')}>Inventory Record</li>
                    </ul>
                </div>

           
                <div className="content">
                    {renderComponent()}
                    
                <PageFooter onBack={goToBackScreen} onNext={goToNextScreen} />
                   
                </div>
           
           
            </div>
     
        </>
    );
}

export default Homepage1;
