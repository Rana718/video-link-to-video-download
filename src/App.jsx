import React, { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState('');
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [error, setError] = useState('');

  const handleFetchFormats = async () => {
    try {
      setError('');
      const response = await axios.post('http://localhost:5000/formats', { url });
      setFormats(response.data.formats);
    } catch (err) {
      setError('Error fetching formats. Please check the URL and try again.');
    }
  };

  const handleDownload = async () => {
    if (!selectedFormat) {
      setError('Please select a format before downloading.');
      return;
    }

    try {
      setError('');
      console.log('Sending download request with:', { url, format: selectedFormat });
      const response = await axios.post('http://localhost:5000/download', { url, format: selectedFormat }, {
        responseType: 'blob'
      });

      if (formats.find(format => format.itag === selectedFormat && format.container !== 'mp4')) {
        setError('Selected format is not in .mp4. Please select a different format.');
        return;
      }
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `video.mp4`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading video:', err);
      setError('Error downloading video. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">YouTube Video Downloader</h1>
        <input type="text" placeholder="Enter YouTube URL" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded mb-4"/>
        <button onClick={handleFetchFormats} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Fetch Formats
        </button>
        {formats.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl mb-2">Select Quality:</h2>
            <select onChange={(e) => setSelectedFormat(e.target.value)} className="w-full px-3 py-2 border rounded mb-4" value={selectedFormat}>
              <option value="">Select a format</option>
              {formats.map((format, index) => (
                (format.container === 'mp4') && (
                  <option key={index} value={format.itag}>
                    {format.qualityLabel || format.resolution} - {format.container}
                  </option>
                )
              ))}
            </select>
            <button onClick={handleDownload} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
              Download
            </button>
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default App;
