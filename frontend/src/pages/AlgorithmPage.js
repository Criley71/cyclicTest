import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function AlgorithmPage({ csvData }) {
  const [results, setResults] = useState([]);
  const [lowHourlyTrends, setLowHourlyTrends] = useState(new Map());
  const [highHourlyTrends, setHighHourlyTrends] = useState(new Map());
  const [insulinDosageTime, setInsulinDosageTime] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [insulinDosage, setInsulinDosage] = useState('');
  const [carbCount, setCarbCount] = useState('');
  const [mealName, setMealName] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [mealTimeSuggestionsList, setMealTimeSuggestionsList] = useState([]);
  const [successfulMealTime, setSuccessfulMealTime] = useState('');
  const [unsuccessfulMealTime, setUnsuccessfulMealTime] = useState('');
  const [bslUpperBound, setBslUpperBound] = useState(200);
  const [bslLowerBound, setBslLowerBound] = useState(80);
  const [parsedData, setParsedData] = useState([]);

  const handleDataEntry = () => {
    if (insulinDosageTime && mealTime && insulinDosage && carbCount && mealName) {
      const time = new Date(insulinDosageTime);
      const bsl = parseFloat(document.getElementById('bslInput').value);

      if (!isNaN(bsl)) {
        handleDataEntry(time, bsl, insulinDosageTime, mealTime, insulinDosage, carbCount, mealName);
      }
    }
  };

  const processCSVData = (data) => {
    if (data) {
      // Parse the CSV data and extract relevant information
      const parsedData = Papa.parse(data, { header: true }).data;
      const glucoseData = parsedData.map((row) => ({
        timestamp: row['Timestamp (YYYY-MM-DDThh:mm:ss)'],
        glucoseValue: parseFloat(row['Glucose Value (mg/dL)']),
      }));

      // Arrays to store low and high matching events
      const lowMatchingEvents = [];
      const highMatchingEvents = [];

      // Iterate through the glucose data and check for low and high blood sugar events
      glucoseData.forEach((entry) => {
        if (!isNaN(entry.glucoseValue)) {
          if (entry.glucoseValue > bslUpperBound) {
            highMatchingEvents.push(`High blood sugar event at time ${entry.timestamp}`);
            flagHighHourlyTrend(entry.timestamp);
          } else if (entry.glucoseValue < bslLowerBound) {
            lowMatchingEvents.push(`Low blood sugar event at time ${entry.timestamp}`);
            flagLowHourlyTrend(entry.timestamp);
          }
        }
      });

      // Update the results with matching events
      setResults([...lowMatchingEvents, ...highMatchingEvents]);

      // Set the parsed data for further use
      setParsedData(glucoseData);
    }
  };

  const flagLowHourlyTrend = (timestamp) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const newTrends = new Map(lowHourlyTrends);
    newTrends.set(hour, (newTrends.get(hour) || 0) + 1);
    setLowHourlyTrends(newTrends);
  };

  const flagHighHourlyTrend = (timestamp) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const newTrends = new Map(highHourlyTrends);
    newTrends.set(hour, (newTrends.get(hour) || 0) + 1);
    setHighHourlyTrends(newTrends);
  };

  const handleSuggestions = () => {
    const insulinTime = new Date(insulinDosageTime);
    const insulinHour = insulinTime.getHours();
    const checkStartTime = new Date(insulinTime);
    checkStartTime.setHours(insulinHour - 3);
    const checkEndTime = new Date(insulinTime);
    checkEndTime.setHours(insulinHour + 3);

    let successful = true;
    let mealTimeSuggestions = [];
    let insulinStackingWarnings = [];

    for (const entry of parsedData) {
      const { timestamp, glucoseValue, mealTime: entryMealTime, insulinDosage: entryInsulinDosage, carbCount: entryCarbCount, mealName: entryMealName } = entry;
      const time = new Date(timestamp);

      if (time >= checkStartTime && time <= checkEndTime) {
        if (glucoseValue > bslUpperBound || glucoseValue < bslLowerBound) {
          successful = false;

          const tenMinsAfterInsulin = new Date(insulinTime);
          tenMinsAfterInsulin.setMinutes(insulinTime.getMinutes() + 10);

          if (entryMealTime && new Date(entryMealTime) >= tenMinsAfterInsulin && new Date(entryMealTime) <= insulinTime) {
            mealTimeSuggestions.push(`Unsuccessful Meal Time at ${entryMealTime}`);
            setUnsuccessfulMealTime(entryMealTime);
          }

          if (glucoseValue > bslUpperBound) {
            setSuggestions(`High Event Occurred, consider ${entryMealName} having more carbs than accounted for ${entryCarbCount} or increasing insulin to carb ratio`);
          } else if (glucoseValue < bslLowerBound) {
            setSuggestions(`Low Event Occurred, consider ${entryMealName} having less carbs than accounted for ${entryCarbCount} or increasing insulin to carb ratio`);
          }

          if (glucoseValue < bslLowerBound && time !== insulinDosageTime) {
            const olderInsulinDosageTime = new Date(insulinDosageTime);
            olderInsulinDosageTime.setHours(insulinHour - 3); // Assuming insulin can last up to 3 hours
            if (time >= olderInsulinDosageTime && time <= insulinDosageTime) {
              insulinStackingWarnings.push(`Insulin stacking warning. Low event detected after Insulin was administered at ${insulinDosageTime}  ${entryInsulinDosage}. Insulin was also administered at ${time} ${entryInsulinDosage}`);
            }
          }
        }
      }
    }

    if (successful) {
      setSuccessfulMealTime(insulinDosageTime);
      setMealTimeSuggestionsList(mealTimeSuggestions);
    }
  };

  useEffect(() => {
    processCSVData(csvData.data);
  }, [csvData]);

  return (
    <div>
      <h1>Suggestions Algorithm</h1>
      <div>
        <label>BSL Upper Bound: </label>
        <input type="number" id="upperBound" value={bslUpperBound} onChange={(e) => setBslUpperBound(e.target.value)} />
        <label>BSL Lower Bound: </label>
        <input type="number" id="lowerBound" value={bslLowerBound} onChange={(e) => setBslLowerBound(e.target.value)} />
        <button onClick={handleSuggestions}>Run Algorithm</button>
      </div>
      <div>
        <h2>Results:</h2>
        <ul>
          {results.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Low Hourly Trends:</h2>
        <ul>
          {[...lowHourlyTrends.entries()]
            .filter(([, count]) => count > 1)
            .map(([hour, count], index) => (
              <li key={index}>{`Hour: ${hour}, Count: ${count}`}</li>
            ))}
        </ul>
      </div>
      <div>
        <h2>High Hourly Trends:</h2>
        <ul>
          {[...highHourlyTrends.entries()]
            .filter(([, count]) => count > 1)
            .map(([hour, count], index) => (
              <li key={index}>{`Hour: ${hour}, Count: ${count}`}</li>
            ))}
        </ul>
      </div>
      <div>
        <h2>Insulin Dosage and Suggestions:</h2>
        <div>
          <label>Insulin Dosage Time: </label>
          <input type="datetime-local" id="insulinDosageTime" onChange={(e) => setInsulinDosageTime(e.target.value)} />
        </div>
        <div>
          <label>Meal Time: </label>
          <input type="datetime-local" id="mealTime" onChange={(e) => setMealTime(e.target.value)} />
        </div>
        <div>
          <label>Insulin Dosage: </label>
          <input type="text" id="insulinDosage" onChange={(e) => setInsulinDosage(e.target.value)} />
        </div>
        <div>
          <label>Carb Count: </label>
          <input type="text" id="carbCount" onChange={(e) => setCarbCount(e.target.value)} />
        </div>
        <div>
          <label>Meal Name: </label>
          <input type="text" id="mealName" onChange={(e) => setMealName(e.target.value)} />
        </div>
        <button onClick={handleDataEntry}>Add Data</button>
        <div>
          <h3>Suggestions:</h3>
          <p>{suggestions}</p>
        </div>
        <div>
          <h3>Meal Time Suggestions:</h3>
          <ul>
            {mealTimeSuggestionsList.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Successful Meal Time:</h3>
          <p>{successfulMealTime}</p>
        </div>
        <div>
          <h3>Unsuccessful Meal Time:</h3>
          <p>{unsuccessfulMealTime}</p>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmPage;
