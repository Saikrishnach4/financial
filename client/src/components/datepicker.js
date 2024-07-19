import React, { useState } from 'react';
import { DateRangePicker } from 'react-dates';
// import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';  // Add this line
import 'react-dates/lib/css/_datepicker.css';

import axios from 'axios';

const DateRangePickerComponent = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    if (startDate && endDate) {
      onDateRangeChange(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    }
  };

  return (
    <DateRangePicker
      startDate={startDate}
      startDateId="your_unique_start_date_id"
      endDate={endDate}
      endDateId="your_unique_end_date_id"
      onDatesChange={handleDatesChange}
      focusedInput={focusedInput}
      onFocusChange={focusedInput => setFocusedInput(focusedInput)}
      isOutsideRange={() => false}
    />
  );
};

export default DateRangePickerComponent;
