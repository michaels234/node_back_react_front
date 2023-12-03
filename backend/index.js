// eaglys/backend/index.js

const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();
app.use(cors());
const port = 3001;
const devOrProd = 'dev';
//const devOrProd = 'prod';

// Set up AWS DynamoDB configuration
if (devOrProd === 'dev') {
    // DynamoDB Local configuration for development
    AWS.config.update({
        region: 'localhost',
        endpoint: 'http://localhost:8000', // DynamoDB Local endpoint
        accessKeyId: 'xxxx',
        secretAccessKey: 'xxxx',
    });
} else {
    // Real DynamoDB configuration for production
    AWS.config.update({
        region: 'us-east-1',
    });
}

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// a simple route
app.get('/api/data', async(req, res) => {
    try {
        // initial data to be inserted into DynamoDB
        const params = {
            TableName: 'node_react_hash_map',
            Item: {
                key: 'keyvalue',
                other: 'othervalue',
            },
        };

        // Put data into DynamoDB
        await dynamoDB.put(params).promise();

        // Retrieve data from DynamoDB
        const getResult = await dynamoDB.get({
            TableName: 'node_react_hash_map',
            Key: {
                key: 'keyvalue',
            },
        }).promise();

        res.json({ message: getResult.Item ? getResult.Item.key : 'No data found' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});