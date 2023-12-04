import React, { useState } from 'react';

function App() {
  const [response, setResponse] = useState('');

  // Change this like an environment variable
  const env = 'dev'
//  const env = 'prod'
  console.log('dev or prod:', env);

  const baseUrl = env === 'dev' ? 'http://localhost:3001' : 'https://my-production-url';

  async function parseSQL() {
	const sqlInput = document.getElementById('sqlInput').value;

	try {
	  const response = await fetch(`${baseUrl}/api/modify`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ sql: sqlInput }),
	  });

	  const data = await response.json();
	  document.getElementById('result').innerText = JSON.stringify(data["message"], null, 2).replace(/\\"/g, '"').slice(1, -1);
	} catch (error) {
	  console.error('Error:', error);
	}
  }

  async function getAllMappings() {
	try {
	  const response = await fetch(`${baseUrl}/api/map`);

	  const data = await response.json();
	  document.getElementById('result').innerText = JSON.stringify(data["message"], null, 2);
	} catch (error) {
	  console.error('Error:', error);
	}
  }

  return (
	<div>
		<form id="sqlForm">
			<label for="sqlInput">Enter SQL Query:</label>
			<input type="text" id="sqlInput" name="sqlInput" required/>
			<br/><br/>
			<button type="button" onClick={parseSQL}>Parse SQL</button>
			<br/><br/>
			<button type="button" onClick={getAllMappings}>Get All Mappings</button>
		</form>
		<br/>
		<div>RESULTS:</div>
		<br/>
		<div id="result"></div>
	</div>
  );
}

export default App;
