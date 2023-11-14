# Movie Service

This Project provides users to register, login and add/update/delete/view their favorite movies.

---

## Requirements

For development, you will only need Node.js, npm, and postgres installed in your environement.

    $ node --version
    v16.16.0.

    $ npm --version
    8.11.0

    $ postgres --version
    16.1

---

## Install

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd movie-service
    $ npm i

## Configure app

Open `/.env` replace PGPASSWORD with you postgres user password

## Configure postgress

    $ cd movie-service
    $ set PGPASSWORD=<your-password>
    $ psql -U postgres -f db-schema.sql

## Running the project

    $ npm run start
