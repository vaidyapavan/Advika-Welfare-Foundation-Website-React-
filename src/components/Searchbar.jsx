import React from 'react';
import '../assets/search.css';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Dropdown, DropdownMenuItemType } from '@fluentui/react/lib/Dropdown';

const Searchbar = ({ searchTerm, handleChange, handleClear, genderTerm, genderChange, hobbyTerms, handleHobbyChange }) => {
  
  const hobbies = [
    { key: 'All', text: 'All', itemType: DropdownMenuItemType.Header },
    { key: 'Cricket', text: 'Cricket' },
    { key: 'Singing', text: 'Singing' },
    { key: 'Badminton', text: 'Badminton' },
    { key: 'Painting', text: 'Painting' },
    { key: 'Gaming', text: 'Gaming' },
    { key: 'Travelling', text: 'Travelling' },
    { key: 'Cooking', text: 'Cooking' },
    { key: 'Reading', text: 'Reading' },
    { key: 'Writing', text: 'Writing' },
  ];

  const dropdownStyles = { dropdown: { width: 300 } };

  // Function to handle hobby filter change
  const onHobbyChange = (event, option) => {
    const selectedKeys = option.selected
      ? [...hobbyTerms, option.key] // Add new hobby key if selected
      : hobbyTerms.filter(key => key !== option.key); // Remove hobby key if deselected
    handleHobbyChange(selectedKeys); // Update state with new selected keys
  };
  

  return (
    <div className='search'>
    
    
      <div className='searchinput'>
      
      

        <input
          type='text'
          placeholder='Search by Name'
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm ? (
          <CloseIcon onClick={handleClear} style={{ cursor: 'pointer' }} />
        ) : (
          <SearchIcon />
        )}
      </div>

      <div className='gender'>
        <label ><h6>Gender:</h6></label>
        <select value={genderTerm} onChange={genderChange}>
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className='hobbies'>
        <label><h6>Hobbies:</h6></label>
        <Dropdown
          placeholder="Select Hobbies"
          selectedKeys={hobbyTerms}
          multiSelect
          options={hobbies}
          onChange={onHobbyChange}
          styles={dropdownStyles}
        />
      </div>
    </div>
  );
};

export default Searchbar;
