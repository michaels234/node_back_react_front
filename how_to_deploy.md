# build and run docker, which creates the images
docker-compose up --build

# create an ECS repository
(in the AWS management console, go to the amazon ECS service. create a new repository for each docker image (frontend and backend))

# tag and push docker images
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

docker tag node_back_react_front-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/node_back_react_front-frontend:latest

docker tag node_back_react_front-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/node_back_react_front-backend:latest

docker push <account-id>.dkr.ecr.<region>.amazonaws.com/node_back_react_front-frontend:latest

docker push <account-id>.dkr.ecr.<region>.amazonaws.com/node_back_react_front-backend:latest

# an overview the rest of the AWS management console tasks
create ECS task definitions
create ECS services
add an application load balancer (ALB)
start ecs services to run the containers
make sure security groups are set up so you can access the app
go to the load balancer to get the DNS name/endpoint
go to the DNS name/endpoint in the browser to access the web app
