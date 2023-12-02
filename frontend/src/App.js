import React, { useState } from 'react';

function App() {
  const [response, setResponse] = useState('');

  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://my-production-url';

  const fetchData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/data`);
      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>React Frontend</h1>
      <button onClick={fetchData}>Fetch Data from Backend</button>
      <p>Response from Backend: {response}</p>
    </div>
  );
}

export default App;
