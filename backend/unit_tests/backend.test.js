// backend.test.js
const request = require('supertest');
const crypto = require('crypto');
const AWS = require('aws-sdk');
const app = require('../index');

AWS.config.update({
    region: 'localhost',
    endpoint: 'http://localhost:8000', // DynamoDB Local endpoint
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
});
const dynamoDB = new AWS.DynamoDB;


// delete all data in dynamodb before running tests
beforeAll(async() => {
    await deleteAll();
});


// run tests
describe('API Endpoints', () => {

    // SELECT column1, column2 FROM test WHERE column1 = 5 AND column2 = 3;
    test('SELECT column1, column2 FROM test WHERE column1 = 5 AND column2 = 3;', async() => {
        const sqlString = "SELECT column1, column2 FROM test WHERE column1 = 5 AND column2 = 3;";

        // /api/modify
        const modifyResponse = await doModify(sqlString)
        const columnTables = [{ column: "column1", table: "null" }, { column: "column2", table: "null" }];
        const hashMap = doHashing(columnTables)

        // check modify
        expect(modifyResponse.body["message"]).toBe(`SELECT \"${hashMap[columnTables[0].column].hash}\", \"${hashMap[columnTables[1].column].hash}\" FROM \"test\" WHERE \"${hashMap[columnTables[0].column].hash}\" = 5 AND \"${hashMap[columnTables[1].column].hash}\" = 3;`);

        // /api/map
        // check map
        await checkMap(columnTables, hashMap);
        await deleteAll();
    });


    // SELECT customers.name, orders.product FROM customers INNER JOIN orders ON customers.id = orders.customer_id WHERE customers.id = 1;
    test('SELECT customers.name, orders.product FROM customers INNER JOIN orders ON customers.id = orders.customer_id WHERE customers.id = 1;', async() => {
        const sqlString = "SELECT customers.name, orders.product FROM customers INNER JOIN orders ON customers.id = orders.customer_id WHERE customers.id = 1;";

        // /api/modify
        const modifyResponse = await doModify(sqlString)
        const columnTables = [{ column: "name", table: "customers" }, { column: "product", table: "orders" }, { column: "id", table: "customers" }, { column: "customer_id", table: "orders" }];
        const hashMap = doHashing(columnTables)

        // check modify
        expect(modifyResponse.body["message"]).toBe(`SELECT \"${hashMap[columnTables[0].column].table}\".\"${hashMap[columnTables[0].column].hash}\", \"${hashMap[columnTables[1].column].table}\".\"${hashMap[columnTables[1].column].hash}\" FROM \"customers\" INNER JOIN \"orders\" ON \"${hashMap[columnTables[2].column].table}\".\"${hashMap[columnTables[2].column].hash}\" = \"${hashMap[columnTables[3].column].table}\".\"${hashMap[columnTables[3].column].hash}\" WHERE \"${hashMap[columnTables[2].column].table}\".\"${hashMap[columnTables[2].column].hash}\" = 1;`);

        // /api/map
        // check map
        await checkMap(columnTables, hashMap);
        await deleteAll();
    });


    // SELECT column1, column2 FROM table1 WHERE column3 = (SELECT MAX(column3) FROM table2 WHERE column3 = 2);
    test('SELECT column1, column2 FROM table1 WHERE column3 = (SELECT MAX(column3) FROM table2 WHERE column3 = 2);', async() => {
        const sqlString = "SELECT column1, column2 FROM table1 WHERE column3 = (SELECT MAX(column3) FROM table2 WHERE column3 = 2);";

        // /api/modify
        const modifyResponse = await doModify(sqlString)
        const columnTables = [{ column: "column1", table: "null" }, { column: "column2", table: "null" }, { column: "column3", table: "null" }];
        const hashMap = doHashing(columnTables)

        // check modify
        expect(modifyResponse.body["message"]).toBe(`SELECT \"${hashMap[columnTables[0].column].hash}\", \"${hashMap[columnTables[1].column].hash}\" FROM \"table1\" WHERE \"${hashMap[columnTables[2].column].hash}\" = (SELECT MAX(\"${hashMap[columnTables[2].column].hash}\") FROM \"table2\" WHERE \"${hashMap[columnTables[2].column].hash}\" = 2);`);

        // /api/map
        // check map
        await checkMap(columnTables, hashMap);
        await deleteAll();
    });


    // SELECT COUNT(column1) AS count_per_group, AVG(column2) AS average_value FROM table1 GROUP BY column3;
    test('SELECT COUNT(column1) AS count_per_group, AVG(column2) AS average_value FROM table1 GROUP BY column3;', async() => {
        const sqlString = "SELECT COUNT(column1) AS count_per_group, AVG(column2) AS average_value FROM table1 GROUP BY column3;";

        // /api/modify
        const modifyResponse = await doModify(sqlString)
        const columnTables = [{ column: "column1", table: "null" }, { column: "column2", table: "null" }, { column: "column3", table: "null" }];
        const hashMap = doHashing(columnTables)

        // check modify
        expect(modifyResponse.body["message"]).toBe(`SELECT COUNT(\"${hashMap[columnTables[0].column].hash}\") AS \"count_per_group\", AVG(\"${hashMap[columnTables[1].column].hash}\") AS \"average_value\" FROM \"table1\" GROUP BY \"${hashMap[columnTables[2].column].hash}\";`);

        // /api/map
        // check map
        await checkMap(columnTables, hashMap);
        await deleteAll();
    });
});


async function deleteAll() {
    const allItems = await dynamoDB.scan({
        TableName: 'node_react_hash_map',
    }).promise();
    for (const item of allItems.Items) {
        const params = {
            TableName: 'node_react_hash_map',
            Key: {
                key: item.key, // Use the correct key field here
            },
        };

        await dynamoDB.deleteItem(params).promise();
    }
}


async function doModify(sqlString) {
    const modifyResponse = await request(app)
        .post('/api/modify')
        .set('Accept', 'application/json')
        .send({ sql: sqlString });
    expect(modifyResponse.status).toBe(200);
    return modifyResponse
}


function doHashing(columnTables) {
    let hashMap = {}
    for (const columnTable of columnTables) {
        const hash = crypto.createHash('sha256');
        hash.update(columnTable.column);
        hashMap[columnTable.column] = { hash: hash.digest('hex'), table: columnTable.table };
    }
    return hashMap
}


async function checkMap(columnTables, hashMap) {
    const mapResponse = await request(app).get('/api/map');

    let items = {};
    for (const item of mapResponse.body["message"]) {
        items[item.key] = { hash: item.hash, table: item.table };
    }

    for (let i = 0; i < columnTables.length; i++) {
        expect(items[columnTables[i].column].hash).toBe(hashMap[columnTables[i].column].hash);
        expect(items[columnTables[i].column].table).toBe(hashMap[columnTables[i].column].table);
    }
}