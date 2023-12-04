# run docker
- (note: if you need to, like in windows, open docker desktop first)

- (note: you need to get dynamodb local first. you can pull it from docker if you want: docker pull amazon/dynamodb-local)

- (cd into node_back_react_front directory)

- docker-compose up --build

# create dynamodb local table in another cmd *important*
- aws dynamodb create-table --table-name node_react_hash_map --attribute-definitions AttributeName=key,AttributeType=S --key-schema AttributeName=key,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000

- (after youve started the docker and created the dynamodb table, you can test the web app. see it at http://localhost/)

# note
- (in backend's index.js, should have env = 'docker', this is the default setting though, so if you didn't change it, don't worry about it)
  - (sorry about that, i know it should be set with environment variables but I didn't have time to mess around with that)

- if you run in npm and in docker, sometimes the ports will be taken and so you have to stop whatever is using the ports before in order to run. make sure to stop everything before running another one.
