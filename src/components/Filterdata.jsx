import React, { useState } from 'react';

const Filterdata = ({ data }) => {
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const filterData = () => {
    let filteredData = data;

    // Filter by gender (only 'Male')
    filteredData = filteredData.filter(item => item.gender === 'Male');

    // Filter by selected hobbies
    if (selectedHobbies.length > 0) {
      filteredData = filteredData.filter(item => {
        return selectedHobbies.every(hobby => item.hobbies.includes(hobby))
      }
      );
    }

    return filteredData;
  };

  const handleHobbiesChange = (event) => {
    setSelectedHobbies(Array.from(event.target.selectedOptions, option => option.value));
  };

  return (
    <div>
      <label>Filter by Hobbies:</label>
      <select multiple value={selectedHobbies} onChange={handleHobbiesChange}>
        <option value="Reading">Reading</option>
        <option value="Sports">Sports</option>
        <option value="Music">Music</option>
      </select>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Hobbies</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {filterData().map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.studentClass}</td>
              <td>{item.hobbies.join(', ')}</td>
              <td>{item.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Filterdata;
