# MEAN Stack Single Page Application Starter Pack

This is a starter repository for a Single Page MEAN Stack application. Just clone, install the necessary bits and you have the basic foundation for building your MEAN applications. 

## Prerequisites
### MongoDB
1. Install MongoDB from here: https://www.mongodb.org/
2. Launch MongoDB if not already running: `$ mongod --storageEngine wiredTiger --dbpath /data/db/`
3. Check that it works: 
```
$ mongo
MongoDB shell version: 3.0.0
connecting to: test
> 
```

### NodeJS
1. Install NodeJS from here: https://nodejs.org/
2. Check that it works:
```
$ node --version; node -p 3+4
v5.1.0
7
```

## Installation
1. Download this repository: `git clone https://github.com/jewkesy/meanMovies.git .`
2. Install npm modules: `npm install`
3. Install bower: `sudo npm install bower -g`
4. Install bower dependencies `$ bower install`
5. Install nodemon (optional): `sudo npm install nodemon -g`

## Running Things
1. Ensure you have MongoDB installed and running.  Db configuration is here:  `$ ./config/db.js`
2. Import a sample dataset (optional): `$ mongoimport --db movies --collection movies --file movies.json --jsonArray  --drop`
3. Start up the server: `nodemon` or `node server.js`
4. Point your browser at http://localhost:8080