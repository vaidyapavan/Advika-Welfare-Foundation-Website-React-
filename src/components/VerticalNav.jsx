import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/VerticalNav.css'; // Import the CSS specific to the vertical nav

function VerticalNav({ isSidebarVisible, handleMenuItemClick, sidebarRef }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavigation = (path) => {
    handleMenuItemClick(); // Call the function to handle item click (e.g., close the sidebar)
    navigate(path); // Navigate to the selected path
  };

  return (
    <>
      <nav
        className={`sidebar ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}
        ref={sidebarRef}
        aria-hidden={!isSidebarVisible} // Accessibility improvement
      >
        <div className="sidebar-item" onClick={() => handleNavigation('/Read')}>
          Student
        </div>
        <div className="sidebar-item" onClick={() => handleNavigation('/donation')}>
          Donation
        </div>
        <div className="sidebar-item" onClick={() => handleNavigation('/inventory')}>
          Inventory
        </div>
        <div className="sidebar-item" onClick={() => handleNavigation('/expenses')}>
          Expense
        </div>
      </nav>
    </>
  );
}

export default VerticalNav;
