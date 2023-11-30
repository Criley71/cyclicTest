import React from 'react';
import Papa from 'papaparse';
import AlgorithmPage from './AlgorithmPage';
function CSVFileUploader({ onFileUploaded }) {

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;

    // Iterate over the selected files and parse each one
    for (const file of selectedFiles) {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        const text = event.target.result;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            const parsedData = results.data;
            const csvData = { fileName: file.name, data: text, parsedData };
            onFileUploaded(csvData); // Notify the parent component
          },
        });
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="csvFileInput"
        accept=".csv"
        multiple // Allow multiple file selection
        onChange={handleFileChange}
      />
    </div>
  );
}

export default CSVFileUploader;
