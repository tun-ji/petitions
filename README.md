# e-Petitions Backend Service 

## Installing the Project
Make sure you have Docker, RabbitMQ and NodeJS installed locally
1. Git clone `https://github.com/tun-ji/petitions.git`
2. `cd` into your installation directory
3. Run `npm i`
4. Repeat this for this repository: `http://github.com/tun-ji/notifications.git`
5. Run `docker-compose up -d`
6. You should see two services running in Docker Desktop


## Running the Project
1. Start your containers 
2. Start the petitions service with `npm run start:dev`
3. Start the notifications service with `npm run start:dev`