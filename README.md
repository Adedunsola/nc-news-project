# ADEDUNSOLA'S News API

## Background

This API is built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database used is PSQL, and is interacted with using [node-postgres](https://node-postgres.com/).

## How to create the environment variables for this API
If you wish to clone this project and run it locally, please use the following instructions to create environment variables.

=> Create two new .env files: .env.test and .env.development
=> In the .env.development file, add PGDATABASE=nc_news
=> In the .env.test file, add PGDATABASE=nc_news_test

### DO NOT FORGET!

Don't forget to .gitnore the .env files to ensure that if you decide to push, your personal information is secure. To do this, create a new file called .gitignore and add .env.* in it. 

