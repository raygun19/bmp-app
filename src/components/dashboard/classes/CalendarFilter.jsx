import React from 'react';
import './Classes.css';

/*

Component: CalendarFilter

Tracks which filter check boxes are selected and reports to parent.  

Props: 
 - filterOptions: an array that contains a list of filter options (eg. "Class", "Private Lesson"...)
 - selectedFilters: an array that represents the currently selected filters
 - onChange: function that is called when a checkbox's state changes, triggers rerender of (filtered) events in AdminCalendar

Parents: AdminCalendar
Children: 

*/

const CalendarFilter = ({ filterOptions, selectedFilters, onChange }) => {

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    const updatedFilters = isChecked
      ? [...selectedFilters, value]
      : selectedFilters.filter((filter) => filter !== value);
    onChange(updatedFilters);
  };

  return (
    <div className='calendar-filter'>
      <div className='calendar-filter-label-bold'>Filter:</div>
      {filterOptions.map((option) => (
        <label key={option} className='calendar-filter-label'>
          <input
            type="checkbox"
            value={option}
            checked={selectedFilters.includes(option)}
            onChange={handleCheckboxChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default CalendarFilter;
