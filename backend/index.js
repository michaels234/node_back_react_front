// eaglys/backend/index.js

const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();
app.use(cors());
const port = 3001;
//const isDevelopment = process.env.NODE_ENV === 'development';
const isDevelopment = true;

// Set up AWS DynamoDB configuration
if (isDevelopment) {
    // DynamoDB Local configuration for development
    AWS.config.update({
        region: 'localhost',
        endpoint: 'http://localhost:8000', // DynamoDB Local endpoint
        accessKeyId: 'xxxx',
        secretAccessKey: 'xxxx',
    });
} else {
    // Real DynamoDB configuration for production
    // AWS.config.update({
    //   region: 'your-production-region',
    //   // Add any other production-specific configurations
    // });
}

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// a simple route
app.get('/api/data', async(req, res) => {
    try {
        // initial data to be inserted into DynamoDB
        const params = {
            TableName: 'TestTable',
            Item: {
                exampleKey: 'exampleValue',
            },
        };

        // Put data into DynamoDB
        await dynamoDB.put(params).promise();

        // Retrieve data from DynamoDB
        const getResult = await dynamoDB.get({
            TableName: 'TestTable',
            Key: {
                exampleKey: 'exampleValue',
            },
        }).promise();

        res.json({ message: getResult.Item ? getResult.Item.exampleKey : 'No data found' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});