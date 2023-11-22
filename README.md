# Movie Service

This Project provides users to register, login and add/update/delete/view their favorite movies.

---

## Requirements

For development, you will need Node.js, npm, and postgres installed in your environment.

    $ node --version
    v16.16.0.

    $ npm --version
    8.11.0

    $ postgres --version
    16.1

---

## Install

    $ git clone https://github.com/tars47/movie-service
    $ cd movie-service

## Configure app

Open `/.env` replace PGPASSWORD with you postgres user password

## Configure postgress

    $ cd movie-service
    $ set PGPASSWORD=<your-password>
    $ psql -U postgres -f db-schema.sql

## Running the project

    $ npm i
    $ npm run start

## Video Recording

https://www.loom.com/share/8eb62cd4da02427ba8cecdaa419912b5
