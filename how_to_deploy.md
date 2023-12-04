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

# an overview the rest of the AWS management console tasks for docker deployment
- open ecs in aws and create a new cluster. choose ec2 launch type
- create task definitions for backend and frontend. put the ECR image URIs in the tasks, which are from earlier when we were tagging and pushing to docker
- launch the ec2 instances in the ecs cluser we created. make sure you setup iam roles so you have authority to do what you need
- create ecs services for backend and frontend with the task definitions, and setup load balancer settings etc.
- create a dynamodb table in AWS dynamodb, make sure the table is the same as the one in the source code in the backend
- if you want to setup a custom domain, update DNS settings to point to your load balancer's endpoint
- you should be able to access the custom domain and use the webapp

# alternative method separating front and backend, which i often use
- make api gateway api's for modify and map, connected to lambdas which run the separate functions.
- host the frontend separately, you could even host it on github pages for free if you wanted, doesn't have to be aws.
- add the api urls into the source code so the frontend can call the apis in aws.
- setup the dynamodb table same as i said before.
- this would be a very low cost method.
- the front and back aren't dockerized together so im not sure if this is against the rules for this project, but this is the way i tend to deploy to the public, because its low cost and pretty easy. api gateway + lambda + dynamodb + github pages frontend. it's serverless and you dont have to worry about load balancing, and you only have to pay for when you use it, because its all on-demand usage.
