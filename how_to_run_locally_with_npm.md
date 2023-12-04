# how to run backend for webapp
- (in backend's index.js, should have env = 'npm')
  - (sorry about that, i know it should be set with environment variables but I didn't have time to mess around with that)

- cd backend
- npm install
- npm start

# how to run frontend for webapp in a new cmd
- cd frontend
- npm install
- npm start

# how to run dynamodb local in a new cmd
- (note: you need to get dynamodb local first. you can pull it from docker if you want: docker pull amazon/dynamodb-local. but it will pull it automatically i think if you havent already)

- docker run -d -p 8000:8000 -v dynamodb_data:/home/dynamodblocal amazon/dynamodb-local

- (create dynamodb table *important*:)

- aws dynamodb create-table --table-name node_react_hash_map --attribute-definitions AttributeName=key,AttributeType=S --key-schema AttributeName=key,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000

- (after youve started the backend, started the frontend, and started dynamodb local, you can test the web app. see it at http://localhost:3000/)

# how to run unit tests for backend

- (note, i am assuming that a "query" means only select statements, which I think is an accurate assumption.)

- (note, make sure you are running dynamodb local and you created a table first)

- (in backend's index.js, should have env = 'npm')
  - (sorry about that, i know it should be set with environment variables but I didn't have time to mess around with that)

- cd backend

- npm test

# note:
- if you run in npm and in docker, sometimes the ports will be taken and so you have to stop whatever is using the ports before in order to run. make sure to stop everything before running another one.