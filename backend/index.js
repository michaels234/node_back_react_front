// node_back_react_front/backend/index.js

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const AWS = require('aws-sdk');
const { Parser } = require('node-sql-parser');

const app = express();
app.use(cors());
app.use(express.json());
const parser = new Parser();
const port = 3001;

// change this depending on running in development or production environment
const devOrProd = 'dev';
//const devOrProd = 'prod';

// setup dynamodb connection
if (devOrProd === 'dev') { // use dynamodb local for development
    AWS.config.update({
        region: 'localhost',
        endpoint: 'http://dynamodb:8000', // DynamoDB Local endpoint
        accessKeyId: 'xxxx',
        secretAccessKey: 'xxxx',
    });
} else { // use aws dynamodb for production
    AWS.config.update({
        region: 'us-east-1',
    });
}
const dynamoDB = new AWS.DynamoDB.DocumentClient();

let table

// API for parsing, modifying, and rebuilding sql
app.post('/api/modify', async(req, res) => {
    try {
        // get sql command string
        const sql = req.body.sql;

        // parse sql to AST
        const ast = parser.astify(sql, { database: 'Postgresql' });

        // get table name if only 1 table
        if (ast[0]["from"].length === 1) {
            table = ast[0]["from"][0]["table"]
        }

        // modify AST: replace column names with hashed column names and save mapping in database
        const found = findAndReplaceColumn(ast[0])

        // save mapping of column name to hashed column name to database
        for (const tableColumnName in found) {
            const tableColumn = tableColumnName.split(".")
            const params = {
                TableName: 'node_react_hash_map',
                Item: {
                    key: tableColumn[1],
                    table: tableColumn[0],
                    hash: found[tableColumn[0] + "." + tableColumn[1]],
                },
            };
            await dynamoDB.put(params).promise();
        }

        // rebuild sql with new hashed column names from modified AST
        const newSql = parser.sqlify(ast, { database: 'Postgresql' }).replace(/`/g, "") + ";"

        // return the rebuilt new sql to the frontend
        res.json({ message: newSql });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API for getting all of the mappings of column names to hashed column names
app.get('/api/map', async(req, res) => {
    try {
        // get all items in the dynamodb
        const getResult = await dynamoDB.scan({
            TableName: 'node_react_hash_map',
        }).promise();

        // return all items to the frontend
        res.json({ message: getResult.Items });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function findAndReplaceColumn(node, found = {}) {
    if (node && typeof node === 'object') {
        // if the node is a "column_ref," replace the key "column"
        if (node.type === 'column_ref') {
            // get column name
            const columnName = node.column

            // get hashedColumnName
            let hashedColumnName
            if (node.table + "." + columnName in found) {
                hashedColumnName = found[node.table + "." + columnName]
            } else {
                const hash = crypto.createHash('sha256');
                hash.update(columnName);
                hashedColumnName = hash.digest('hex');

                // add column name to list of column names hashed so far
                found[node.table + "." + columnName] = hashedColumnName;
            }

            // replace column name with hashed column name in AST
            node.column = hashedColumnName;
        }

        // recursively process each property of the current node
        for (const key in node) {
            if (node.hasOwnProperty(key)) {
                findAndReplaceColumn(node[key], found);
            }
        }
    }
    return found
}

// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// export for testing
module.exports = app;