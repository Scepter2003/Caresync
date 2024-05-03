import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import csvWriter from 'csv-writer';
import { saveAs } from 'file-saver';
const fetchData = async (startDate, endDate, location) => {
    const query = db.collectionGroup('diagnosis').where('timestamp', '>=', startDate).where('timestamp', '<=', endDate).where('medicine.location', '==', location);
    const snapshot = await query.get();
    const data = [];
  
    snapshot.forEach((doc) => {
      const diagnosis = doc.data();
      const medicine = diagnosis.medicine.find((m) => m.location === location);
      if (medicine) {
        data.push({
          date: diagnosis.timestamp.toDate(),
          location,
          symptoms: diagnosis.symptoms,
          diagnosis: diagnosis.diagnosis,
          medicine: medicine.name,
        });
      }
    });
  
    return data;
  };
  const exportToCsv = (data, filename) => {
    const csvWriter = csvWriter.createObjectCsvWriter({
      path: `path/to/output/${filename}.csv`,
      header: [
        { id: 'date', title: 'DATE' },
        { id: 'location', title: 'LOCATION' },
        { id: 'symptoms', title: 'SYMPTOMS' },
        { id: 'diagnosis', title: 'DIAGNOSIS' }
      ]
    });
  
    csvWriter.writeRecords(data)
      .then(() => {
        saveAs(`path/to/output/${filename}.csv`, `${filename}.csv`);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const Health = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      setLoading(true);
      setError(null);
  
      try {
        const data = await fetchData(startDate, endDate, location);
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handleExport = () => {
      exportToCsv(data, 'medfile_data');
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Start Date:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            End Date:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <label>
            Location:
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <button type="submit" disabled={loading}>Fetch Data</button>
        </form>
        {error && <p>{error}</p>}
        {data.length > 0 && (
          <>
            <h2>Data</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Symptoms</th>
                  <th>Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.date}>
                    <td>{row.date}</td>
                    <td>{row.location}</td>
                    <td>{row.symptoms}</td>
                    <td>{row.diagnosis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleExport}>Export to CSV</button>
          </>
        )}
      </div>
    );
  };

  export default Health;