# for backend
cd backend

npm install

## how to run unit tests for backend
npm test

(note, i am assuming that a "query" means only select statements.)

## how to run backend for web app
npm run start


# for frontend
cd backend

npm install

## how to run frontend for web app
npm run start


# for dynamodb local
(first of all get dynamodb local however you usually do, you can pull it using docker for example)

## how to run dynamodb local for web app
docker run -d -p 8000:8000 -v dynamodb_data:/home/dynamodblocal amazon/dynamodb-local

aws dynamodb create-table --table-name node_react_hash_map --attribute-definitions AttributeName=key,AttributeType=S --key-schema AttributeName=key,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000

(after youve started the backend, started the frontend, and started dynamodb local, you can test the web app. see it at http://localhost:3000/)
