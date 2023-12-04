# for backend
cd backend

npm install


# for frontend
cd frontend

npm install


# run docker
(note, you need to get dynamodb local first. you can pull it from docker if you want)

cd node_back_react_front
docker-compose up --build

(create dynamodb table)

aws dynamodb create-table --table-name node_react_hash_map --attribute-definitions AttributeName=key,AttributeType=S --key-schema AttributeName=key,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000

(after youve started the docker and created the dynamodb table, you can test the web app. see it at http://localhost/)
