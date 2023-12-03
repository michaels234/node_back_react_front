# run dynamodb local
docker run -d -p 8000:8000 -v dynamodb_data:/home/dynamodblocal amazon/dynamodb-local

# create table in dynamodb local
aws dynamodb create-table --table-name node_react_hash_map --attribute-definitions AttributeName=key,AttributeType=S --key-schema AttributeName=key,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000

# check table info in dynamodb local
aws dynamodb describe-table --table-name node_react_hash_map --endpoint-url http://localhost:8000

# put item into dynamodb local
aws dynamodb put-item --table-name node_react_hash_map --item "key={S=testvalue1}, other={S=othervalue1}" --endpoint-url http://localhost:8000

# get item from dynamodb local
aws dynamodb get-item --table-name node_react_hash_map --key "key={S=testvalue1}" --endpoint-url http://localhost:8000

# curl api for testing backend
curl -H "Content-Type: application/json" -d "{\"sql\":\"SELECT a, b FROM test WHERE a = 5;\"}" -X POST http://localhost:3001/api/modify

# unit tests for backend
npm test

# frontend dev
cd frontend
npm run start

# backend dev
cd backend
npm run start

# frontend build
cd frontend
npm run build
serve -s build

# tag and push docker images to docker hub
docker tag node_back_react_front-frontend:latest michaels234/node_back_react_front-frontend:latest
docker tag node_back_react_front-backend:latest michaels234/node_back_react_front-backend:latest
docker push michaels234/node_back_react_front-frontend:latest
docker push michaels234/node_back_react_front-backend:latest