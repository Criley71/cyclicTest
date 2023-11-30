import React, { useState, useEffect } from 'react';
import CsvFileUploader from './CSVFileUploader';
import AlgorithmPage from './AlgorithmPage';
import Graphs from './Graphs'; // Import the Graphs component

function ImportCSVPage() {
  const [csvFiles, setCsvFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAlgorithmPage, setShowAlgorithmPage] = useState(false); // State to control AlgorithmPage visibility
  const [showGraphs, setShowGraphs] = useState(false); // State to control Graphs visibility

  const handleFileUploaded = (csvData) => {
    console.log('Uploaded CSV Data:', csvData);
    setSelectedFile(csvData);
    setCsvFiles((prevFiles) => [...prevFiles, csvData]);
  };

  const handleSelectFile = (event) => {
    const fileName = event.target.value;
    const selected = csvFiles.find((csv) => csv.fileName === fileName);
    setSelectedFile(selected);
  };

  const handleRemoveFile = () => {
    if (selectedFile) {
      setCsvFiles((prevFiles) => prevFiles.filter((file) => file !== selectedFile));
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    console.log('Selected File:', selectedFile);
  }, [selectedFile]);

  const handleAlgorithmButtonClick = () => {
    setShowAlgorithmPage(true);
    setShowGraphs(false); // Hide the Graphs component
  };

  const handleGraphsButtonClick = () => {
    setShowGraphs(true);
    setShowAlgorithmPage(false); // Hide the AlgorithmPage component
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Import CSV</h1>
      <CsvFileUploader onFileUploaded={handleFileUploaded} />
      <div>
        <h2>Imported CSV Files:</h2>
        <ul>
          {csvFiles.map((csvData, index) => (
            <li key={index}>{csvData.fileName}</li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Select CSV File:</h2>
        <select onChange={handleSelectFile}>
          <option value="">Select a CSV File</option>
          {csvFiles.map((csvData, index) => (
            <option key={index} value={csvData.fileName}>
              {csvData.fileName}
            </option>
          ))}
        </select>
        <button onClick={handleRemoveFile} disabled={!selectedFile}>
          Remove
        </button>
      </div>
      <div>
        <button onClick={handleAlgorithmButtonClick}>Run Algorithm</button>
        <button onClick={handleGraphsButtonClick}>Show Graphs</button>
      </div>
      {showAlgorithmPage && selectedFile && <AlgorithmPage csvData={selectedFile} />}
      {showGraphs && selectedFile && <Graphs csvData={selectedFile} />}
    </div>
  );
}

export default ImportCSVPage;
