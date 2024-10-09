import React from 'react';
import '../assets/search.css';
import { Dropdown, DropdownMenuItemType } from '@fluentui/react/lib/Dropdown';
import { SearchBox } from '@fluentui/react/lib/SearchBox';

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

  const genders = [
    { key: '', text: 'All' },
    { key: 'male', text: 'Male' },
    { key: 'female', text: 'Female' },
  ];

  // Function to handle hobby filter change
  const onHobbyChange = (event, option) => {
    const selectedKeys = option.selected
      ? [...hobbyTerms, option.key] // Add new hobby key if selected
      : hobbyTerms.filter(key => key !== option.key); // Remove hobby key if deselected
    handleHobbyChange(selectedKeys); // Update state with new selected keys
  };

  return (
    <div className="search-container">
      <div className="search-input">
        {/* Fluent UI SearchBox */}
        <SearchBox
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(_, newValue) => handleChange(newValue)} // Passing newValue directly to handleChange
          onClear={handleClear}
        />
      </div>

      <div className="gender-filter">
        <label>Gender:</label>
        <Dropdown
  placeholder="Select Gender"
  selectedKey={genderTerm} // Controlled component: selected value
  options={genders}
  onChange={(event, option) => genderChange(event, option)} // Pass both event and option
/>

      </div>

      <div className="hobbies-filter">
        <label>Hobbies:</label>
        <Dropdown
          placeholder="Select Hobbies"
          selectedKeys={hobbyTerms}
          multiSelect
          options={hobbies}
          onChange={onHobbyChange}
        />
      </div>
    </div>
  );
};

export default Searchbar;
