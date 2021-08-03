docker build . -t scc_api:latest && 
docker rm --force scc_api &&  
docker run -p 3001:3001 --name scc_api  -d  scc_api