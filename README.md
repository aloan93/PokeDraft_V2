# PokeDraft API (WIP)

A RESTful API to serve as the backend for my 'Pokedraft' personal project. This is designed to be a platform for members of the Pokemon video-gaming community to organised and document draft tournaments.

## Getting started with local running

Before cloning this repo you will need to have Node.js and NPM installed on your machine. Instructions for doing this can be found at:

Node.js --> https://nodejs.org/en/download

NPM --> https://docs.npmjs.com/getting-started

This project also makes use of MySQL, however this currently designed to be run inside a Docker container, and so you will need to have Docker installed on your machine. Instructions for doing this can be found at:

Docker --> https://docs.docker.com/engine/install

### Step 1: Cloning

Clone this repository to your machine and navigate to the root directory with the following terminal commands:

```
git clone https://github.com/aloan93/be-pokedraft_v2.git
cd be-pokedraft_v2
```

### Step 2: Installing dependencies

Install all the packages required to run this repositry via NPM using the following terminal command:

```
npm install -D
```

### Step 3: Creating and seeding the database

Before creating and seeding the database you will need to create a `.env` file. Make sure you are in the root directory for the repositry and use the following terminal command to create the file:

```
touch .env
```

Insert the following into the `.env` file just created:

```
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_NAME=pokedraft
MYSQL_PORT=3307
```

Now you will be able to spin up the docker container as laid out in the `docker-compose.yml` file using the following command:

```
docker-compose -f docker-compose.yml up
```

Now that MySQL is spun up in the container along with the Pokedraft database, you can now seed the database with the tables and pokemon data using the following command:

```
npm run seed
```

### Step 4: Accessing the API and database admin

You can start the application by running the following command:

```
npm start
```

Once running you will be able to access the API at http://localhost:9000

You can also access the Adminer for logging into the database at http://localhost:8080

### Endpoints

For a breakdown of available endpoints with this API please see the `endpoints.json` file that details each with a desciption and example body/response
