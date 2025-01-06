import React, { useState } from 'react';
import '../assets/Homepage1.css';
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
    };

    const goToNextScreen = () => {
        const currentIndex = sections.indexOf(activeComponent);
        if (currentIndex < sections.length - 1) {
            setActiveComponent(sections[currentIndex + 1]);
        }
    };

    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState('expense'); // Default load Expense component

    const navigateTo = (section) => {
        setActiveComponent(section);
    };

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
    };

    return (
        <>
            <div className="container">
                {/* Sidebar navigation */}
                <div className="sidebar">
                    <AccountBoxIcon style={{ fontSize: "80px", marginLeft: "auto", marginRight: "auto" }} />
                    <h3>{email}</h3>
                    <ul className="nav-items">
                        {sections.map((section) => (
                            <li
                                key={section}
                                className={activeComponent === section ? 'active' : ''}
                                onClick={() => navigateTo(section)}
                            >
                                {section.charAt(0).toUpperCase() + section.slice(1)} Data
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="content">
                    {renderComponent()}
                    <PageFooter onBack={goToBackScreen} onNext={goToNextScreen} />
                </div>
            </div>
        </>
    );
};

export default Homepage1;
