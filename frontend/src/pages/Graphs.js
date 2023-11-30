import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Calendar from 'react-calendar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import Header from '../components/Header';
function Graphs({ csvData }) {
  const [glucoseData, setGlucoseData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('2023-08-25'); // Set your selected date here
  const [dateList, setDateList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelection = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
    setSelectedDate(formattedDate);
    setShowCalendar(false); // Close the calendar when a date is selected
  };

  const handleDailyReportsClick = () => {
    setShowCalendar(true); // Show the calendar when Daily Reports button is clicked
  };

  // An array of month names
  const monthList = [
    'January', 'February', 'March', 'April  ', 'May ', 'June  ', 'July  ',
    'August  ', 'September   ', 'October  ', 'November   ', 'December     '
  ];


  const handleMonthSelection = (selectedMonth) => {
    const monthNameToNumber = {
      'January': '01',
      'February': '02',
      'March': '03',
      'April': '04',
      'May': '05',
      'June': '06',
      'July': '07',
      'August': '08',
      'September': '09',
      'October': '10',
      'November': '11',
      'December': '12',
    };

    // Get the numerical value for the selected month
    const selectedMonthNumber = monthNameToNumber[selectedMonth];

    // Filter data for the selected month
    if (csvData && Array.isArray(csvData.data)) { // this condition is false
      console.log("helo") // not going into if statement causing the month data to not pop up on the graph 
      const selectedMonthData = csvData.data.filter((row) => {
        const timestamp = row['Timestamp (YYYY-MM-DDThh:mm:ss)'];
        const month = timestamp.split('-')[1]; // Extracting the month in 'MM' format
        return month === selectedMonthNumber;
      });

      if (selectedMonthData.length > 0) { //so this is always false
        const extractedMonthData = selectedMonthData.map((row) => {
          return {
            timestamp: row['Timestamp (YYYY-MM-DDThh:mm:ss)'],
            date: row['Timestamp (YYYY-MM-DD hh:mm:ss)'].split(' ')[0],
            glucoseValue: parseFloat(row['Glucose Value (mg/dL)']),
          };
        });
        // console.log('Month Data:', extractedMonthData); // Log the month data
        setGlucoseData(extractedMonthData);
      } else {
        setGlucoseData([]); // Reset data or show an error message
      }
    }
  };

  useEffect(() => {
    if (csvData && csvData.data) {

      // Use PapaParse to parse the CSV data
      Papa.parse(csvData.data, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.data) {
            const selectedDateData = result.data.filter((row) => {
              const timestamp = row['Timestamp (YYYY-MM-DDThh:mm:ss)'];
              return timestamp?.startsWith(selectedDate);
            });
            if (selectedDateData.length === 0) {
              setGlucoseData([]); // No data for the selected date
            }
            else {
              // Extract and format data for the chart
              const extractedData = selectedDateData.map((row) => {
                const timestamp = row['Timestamp (YYYY-MM-DDThh:mm:ss)'];
                const dateParts = timestamp.split(' ');
                return {
                  date: dateParts[0],
                  time: dateParts[1],
                  glucoseValue: parseFloat(row['Glucose Value (mg/dL)']),
                };
              });
              setGlucoseData(extractedData);
            }
          }
        },
      });
    }
  }, [csvData, selectedDate]);

  return (
    <div>

      <h1>Glucose Level Over Time</h1>
      <h2>Data Displaying For: {selectedMonth || selectedDate}</h2>

      <div>
        <Button
          variant="primary"
          style={{ marginRight: '10px' }}
          onClick={handleDailyReportsClick}
        >
          Daily Reports
        </Button>

      </div>

      {showCalendar && (
        <Calendar onChange={handleDateSelection} value={new Date(selectedDate)} />
      )}

      {/* Monthly Reports with dropdown */}
      <div style={{ marginBottom: '50px' }}>
        <DropdownButton title="Monthly Reports" onSelect={handleMonthSelection}>
          {monthList.map((month) => (
            <Dropdown.Item key={month} eventKey={month}>
              {month}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>

      {selectedMonth ? ( // Check if a month is selected
        // this is for month
        glucoseData.length === 0 ? ( // Check if data for the month exists
          <p>Data doesn't exist for the chosen month</p>
        ) : (
          <LineChart width={800} height={400} data={glucoseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis dataKey="glucoseValue" />
            <Tooltip />
            <Legend />
            {/* <Line type="monotone" dataKey="glucoseValue" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
            <Line
              type="monotone"
              dataKey="glucoseValue"
              activeDot={{ r: 8 }}
              stroke={{
                base: '#8884d8', // Default color
                value: (value) => {
                  if (value < 70 || value > 200) {
                    return 'red'; // Highlight in red if below 70 or above 200
                  }
                  return '#8884d8'; // Default color
                },
              }}
            />

          </LineChart>
        )
      ) : (

        // this is for date
        glucoseData.length === 0 ? (
          <p>Data doesn't exist for the chosen date</p>
        ) : (
          <LineChart width={800} height={400} data={glucoseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis dataKey="glucoseValue" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="glucoseValue" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        )
      )}
    </div>
  );

}
export default Graphs;


